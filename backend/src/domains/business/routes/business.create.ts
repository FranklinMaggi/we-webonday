// ======================================================
// BE || routes/tenant/business/business.create.ts
// ======================================================
//
// CREATE BUSINESS (MULTI-BUSINESS)
// POST /api/business/create
//
// RUOLO:
// - Crea un Business per un utente autenticato
// - Supporta più business per lo stesso user
//
// INVARIANTI:
// - user derivato SOLO da sessione (requireAuthUser)
// - FE NON passa userId
// - BusinessSchema è verità assoluta
//
// POLICY:
// - Free tier: max 5 business per user
// - Oltre 5: PREMIUM_REQUIRED (402)
//
// KV (SOURCE OF TRUTH):
// - BUSINESS:{businessId}                    → Business domain object
// - USER_BUSINESSES:{userId}                → BusinessSummary[]
// - USER_BUSINESS_COUNT:{userId}            → number
// ======================================================

import type { Env } from "../../../types/env";

import { BusinessSchema } from "../schema/business.schema";
import { normalizeBusinessInput } from "../business.input.normalizer";
import { BUSINESS_KEY } from "../../../lib/kv";
import { requireAuthUser } from "@domains/auth";
import { json } from "../../auth/route/helper/https";

/* =========================
   KV KEYS (LOCAL)
   - per ora locali al route
   - se vuoi, poi li spostiamo in lib/kv.ts
========================= */
const USER_BUSINESSES_KEY = (userId: string) => `USER_BUSINESSES:${userId}`;
const USER_BUSINESS_COUNT_KEY = (userId: string) =>
  `USER_BUSINESS_COUNT:${userId}`;

/* =========================
   LIMITS
========================= */
const FREE_MAX_BUSINESSES = 5;

/* =========================
   UTILS
========================= */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ======================================================
   POST /api/business/create
====================================================== */
export async function createBusiness(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1) AUTH (HARD)
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const user = session.user;

  /* =====================
     2) PARSE BODY
  ====================== */
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_JSON_BODY" }, request, env, 400);
  }

  /* =====================
     3) NORMALIZE INPUT (NO ZOD HERE)
  ====================== */
  const input = normalizeBusinessInput(rawBody as any);

  if (!input.name || !input.address || !input.phone) {
    return json({ ok: false, error: "MISSING_REQUIRED_FIELDS" }, request, env, 400);
  }

  // ORIGINE COMMERCIALE: obbligatoria nel nuovo schema
  if (!input.solutionId || !input.productId) {
    return json({ ok: false, error: "MISSING_COMMERCIAL_ORIGIN" }, request, env, 400);
  }

  /* =====================
     4) FREE LIMIT GUARD (MAX 5)
  ====================== */
  const countKey = USER_BUSINESS_COUNT_KEY(user.id);
  const countRaw = await env.BUSINESS_KV.get(countKey);
  const count = Number(countRaw ?? "0");

  if (Number.isNaN(count)) {
    // se indice corrotto, non blocchiamo la creazione ma resettiamo a 0
    await env.BUSINESS_KV.put(countKey, "0");
  } else if (count >= FREE_MAX_BUSINESSES) {
    return json({ ok: false, error: "PREMIUM_REQUIRED" }, request, env, 402);
  }

  /* =====================
     5) BUILD DOMAIN OBJECT
  ====================== */
  const businessId = crypto.randomUUID();

  // publicId leggibile, con suffix anti-collisione
  const base = slugify(input.name || "business");
  const suffix = crypto.randomUUID().slice(0, 6);
  const publicId = `${base}-${suffix}`;

  const domainCandidate = {
    id: businessId,
    publicId,
    ownerUserId: user.id,

    name: input.name,
    address: input.address,
    phone: input.phone,
    openingHours: input.openingHours ?? undefined,

    // ORIGINE COMMERCIALE
    solutionId: input.solutionId,
    productId: input.productId,
    optionIds: input.optionIds,

    // MEDIA default (nessun upload in create)
    logoUrl: null,
    coverImageUrl: null,
    galleryImageUrls: [],

    // DESIGN PROFILE default
    designProfile: undefined,

    // REFERRAL
    referralToken: crypto.randomUUID().slice(0, 8),
    referredBy: input.referredBy ?? null,

    status: "draft",
    createdAt: new Date().toISOString(),
  };

  /* =====================
     6) VALIDATE (SOURCE OF TRUTH)
  ====================== */
  let business;
  try {
    business = BusinessSchema.parse(domainCandidate);
  } catch {
    return json({ ok: false, error: "BUSINESS_VALIDATION_FAILED" }, request, env, 400);
  }

  /* =====================
     7) PERSIST BUSINESS
  ====================== */
  await env.BUSINESS_KV.put(BUSINESS_KEY(business.id), JSON.stringify(business));

  /* =====================
     8) APPEND USER INDEX
  ====================== */
  const listKey = USER_BUSINESSES_KEY(user.id);
  const list: Array<{
    businessId: string;
    publicId: string;
    name: string;
    status: string;
    createdAt: string;
  }> = (await env.BUSINESS_KV.get(listKey, "json")) ?? [];

  list.push({
    businessId: business.id,
    publicId: business.publicId,
    name: business.name,
    status: business.status,
    createdAt: business.createdAt,
  });

  await env.BUSINESS_KV.put(listKey, JSON.stringify(list));

  /* =====================
     9) INCREMENT COUNT
  ====================== */
  const safeCount = Number.isNaN(count) ? 0 : count;
  await env.BUSINESS_KV.put(countKey, String(safeCount + 1));

  /* =====================
     10) RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessId: business.id,
      status: business.status,
    },
    request,
    env
  );
}
