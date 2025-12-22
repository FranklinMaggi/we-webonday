// backend/src/routes/business.ts

import type { Env } from "../../types/env";

import { BusinessSchema } from "../../schemas/business/businessSchema";
import { normalizeBusinessInput } from "../../normalizers/normalizeBusinessInput";

import { BUSINESS_KEY } from "../../lib/kv";
import { getUserFromSession } from "../../lib/auth/session";
import { json } from "../../lib/https";

/* ======================================================
   CREATE BUSINESS
   POST /api/business/create
====================================================== */
export async function createBusiness(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const user = await getUserFromSession(request, env);
  if (!user) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ PARSE BODY
  ====================== */
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json(
      { ok: false, error: "INVALID_JSON_BODY" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ NORMALIZE INPUT
     (NO validation here)
  ====================== */
  const input = normalizeBusinessInput(rawBody as any);

  if (!input.name || !input.address || !input.phone) {
    return json(
      { ok: false, error: "MISSING_REQUIRED_FIELDS" },
      request,
      env,
      400
    );
  }

  /* =====================
     4️⃣ CHECK EXISTING BUSINESS
  ====================== */
  const existingBusinessId = await env.BUSINESS_KV.get(
    `USER_BUSINESS:${user.id}`
  );

  if (existingBusinessId) {
    return json(
      { ok: false, error: "BUSINESS_ALREADY_EXISTS" },
      request,
      env,
      409
    );
  }

  /* =====================
     5️⃣ BUILD DOMAIN OBJECT
  ====================== */
  const businessId = crypto.randomUUID();

  const domainCandidate = {
    id: businessId,
    ownerUserId: user.id,

    name: input.name,
    address: input.address,
    phone: input.phone,
    openingHours: input.openingHours,

    menuPdfUrl: null,

    // identificatore interno (non pubblico)
    referralToken: crypto.randomUUID().slice(0, 8),
    referredBy: input.referredBy ?? null,

    status: "draft",
    createdAt: new Date().toISOString(),
  };

  /* =====================
     6️⃣ VALIDATE (SOURCE OF TRUTH)
  ====================== */
  let business;
  try {
    business = BusinessSchema.parse(domainCandidate);
  } catch (err) {
    return json(
      {
        ok: false,
        error: "BUSINESS_VALIDATION_FAILED",
      },
      request,
      env,
      400
    );
  }

  /* =====================
     7️⃣ PERSIST
  ====================== */
  await env.BUSINESS_KV.put(
    BUSINESS_KEY(businessId),
    JSON.stringify(business)
  );

  await env.BUSINESS_KV.put(
    `USER_BUSINESS:${user.id}`,
    businessId
  );

  /* =====================
     8️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessId,
      status: business.status,
    },
    request,
    env
  );
}

/* ======================================================
   GET BUSINESS (RAW, INTERNAL USE)
   GET /api/business/:id
====================================================== */
export async function getBusiness(
  request: Request,
  env: Env
): Promise<Response> {
  const id = new URL(request.url).pathname.split("/").pop();

  if (!id) {
    return json(
      { ok: false, error: "MISSING_BUSINESS_ID" },
      request,
      env,
      400
    );
  }

  const raw = await env.BUSINESS_KV.get(BUSINESS_KEY(id));
  if (!raw) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  // Validazione di sicurezza (mai fidarsi del KV)
  let business;
  try {
    business = BusinessSchema.parse(JSON.parse(raw));
  } catch {
    return json(
      { ok: false, error: "CORRUPTED_BUSINESS_DATA" },
      request,
      env,
      500
    );
  }

  return json(
    { ok: true, business },
    request,
    env
  );
}
