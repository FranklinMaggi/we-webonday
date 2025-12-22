// backend/src/routes/business.ts

import type { Env } from "../types/env";
import { BusinessSchema } from "../schemas/business/businessSchema";
import { normalizeBusinessInput } from "../normalizers/normalizeBusinessInput";
import {
  BUSINESS_KEY,
} from "../lib/kv";
import { requireUser } from "../lib/auth";

/* ======================================================
   JSON HELPER (locale, verrà centralizzato)
====================================================== */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ======================================================
   CREATE BUSINESS
   POST /api/business/create
====================================================== */
export async function createBusiness(
  request: Request,
  env: Env
) {
  // 1️⃣ AUTH
  const auth = await requireUser(request, env);
  if (!auth) return json({ error: "Unauthorized" }, 401);
  
  const { userId } = auth;

  // 2️⃣ PARSE BODY
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // 3️⃣ NORMALIZE INPUT (NO VALIDATION)
  const normalized = normalizeBusinessInput(body as any);

  if (!normalized.name || !normalized.address || !normalized.phone) {
    return json({ error: "Missing required fields" }, 400);
  }

  // 4️⃣ CHECK BUSINESS ESISTENTE
  const existingBusinessId =
    await env.BUSINESS_KV.get(`USER_BUSINESS:${userId}`);

  if (existingBusinessId) {
    return json(
      { error: "User already has a business" },
      409
    );
  }

  // 5️⃣ BUILD DOMAIN OBJECT
  const businessId = crypto.randomUUID();

  const rawBusiness = {
    id: businessId,
    ownerUserId: userId,

    name: normalized.name,
    address: normalized.address,
    phone: normalized.phone,
    openingHours: normalized.openingHours,

    menuPdfUrl: null,

    // 🔒 referralToken è SOLO un identificatore interno
    referralToken: crypto.randomUUID().slice(0, 8),
    referredBy: normalized.referredBy,

    status: "draft",
    createdAt: new Date().toISOString(),
  };

  // 6️⃣ VALIDATE (SOURCE OF TRUTH)
  let business;
  try {
    business = BusinessSchema.parse(rawBusiness);
  } catch (err) {
    return json(
      { error: "Business validation failed", details: err },
      400
    );
  }

  // 7️⃣ PERSIST
  await env.BUSINESS_KV.put(
    BUSINESS_KEY(businessId),
    JSON.stringify(business)
  );

  await env.BUSINESS_KV.put(
    `USER_BUSINESS:${userId}`,
    businessId
  );

  return json({
    ok: true,
    status: business.status,
    businessId,
  });
}


/* ======================================================
   GET BUSINESS (RAW, INTERNAL USE)
   GET /api/business/:id
====================================================== */
export async function getBusiness(
  request: Request,
  env: Env
) {
  const id = new URL(request.url).pathname.split("/").pop();

  if (!id) {
    return json({ error: "Missing businessId" }, 400);
  }

  const raw = await env.BUSINESS_KV.get(BUSINESS_KEY(id));
  if (!raw) {
    return json({ error: "Business not found" }, 404);
  }

  // validazione di sicurezza
  const parsed = BusinessSchema.parse(JSON.parse(raw));

  return json({ ok: true, business: parsed });
}
