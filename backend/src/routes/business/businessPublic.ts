// backend/src/routes/businessPublic.ts

import type { Env } from "../../types/env";

import { BusinessSchema } from "../../schemas/core/businessSchema";
import { normalizeBusiness } from "../../normalizers/normalizeBusiness";
import { normalizeBusinessPublic } from "../../normalizers/normalizeBusinessPublic";

import { BUSINESS_KEY } from "../../lib/kv";
import { json } from "../../lib/https";

/* ======================================================
   GET BUSINESS (PUBLIC)
   GET /api/business/public/:id
   Espone SOLO dati pubblici di un business attivo
====================================================== */
export async function getBusinessPublic(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ EXTRACT PARAM
  ====================== */
  const businessId = new URL(request.url).pathname.split("/").pop();

  if (!businessId) {
    return json(
      { ok: false, error: "MISSING_BUSINESS_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     2️⃣ LOAD BUSINESS
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    BUSINESS_KEY(businessId)
  );

  if (!raw) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     3️⃣ VALIDATE DOMAIN
  ====================== */
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

  /* =====================
     4️⃣ PUBLIC GUARD
  ====================== */
  if (business.status !== "active") {
    return json(
      { ok: false, error: "BUSINESS_NOT_ACTIVE" },
      request,
      env,
      403
    );
  }

  /* =====================
     5️⃣ NORMALIZATION PIPELINE
     domain → internal DTO → public DTO
  ====================== */
  const internalDTO = normalizeBusiness(business);
  const publicDTO = normalizeBusinessPublic(internalDTO);

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      business: publicDTO,
    },
    request,
    env
  );
}
