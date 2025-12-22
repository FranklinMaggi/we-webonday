// backend/src/routes/businessMine.ts

import type { Env } from "../../types/env";

import { BusinessSchema } from "../../schemas/business/businessSchema";
import { normalizeBusiness } from "../../normalizers/normalizeBusiness";

import { BUSINESS_KEY } from "../../lib/kv";
import { getUserFromSession } from "../../lib/auth/session";
import { json } from "../../lib/https";

/* ======================================================
   GET MY BUSINESS
   GET /api/business/mine
====================================================== */
export async function getMyBusiness(
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
     2️⃣ LOOKUP USER → BUSINESS
  ====================== */
  const businessId = await env.BUSINESS_KV.get(
    `USER_BUSINESS:${user.id}`
  );

  if (!businessId) {
    return json(
      { ok: true, business: null },
      request,
      env
    );
  }

  /* =====================
     3️⃣ LOAD BUSINESS
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    BUSINESS_KEY(businessId)
  );

  if (!raw) {
    // indice rotto o business cancellato
    return json(
      { ok: true, business: null },
      request,
      env
    );
  }

  /* =====================
     4️⃣ VALIDATE DOMAIN
  ====================== */
  let parsed;
  try {
    parsed = BusinessSchema.parse(JSON.parse(raw));
  } catch {
    return json(
      { ok: false, error: "CORRUPTED_BUSINESS_DATA" },
      request,
      env,
      500
    );
  }

  /* =====================
     5️⃣ NORMALIZE OUTPUT
  ====================== */
  const business = normalizeBusiness(parsed);

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, business },
    request,
    env
  );
}
