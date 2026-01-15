/**
 * ======================================================
 * BE || ROUTES || PUBLIC || BUSINESS
 * File: backend/src/routes/public/partners/businessPublic.ts
 * ======================================================
 *
 * RUOLO:
 * - Espone i dati PUBBLICI di un business attivo
 *
 * NON FA:
 * - NON espone dati privati
 * - NON autentica utenti
 * - NON modifica stato business
 *
 * SECURITY:
 * - Accesso: PUBLIC
 * - Solo business.status === "active"
 *
 * PIPELINE:
 * 1) Estrazione businessId da URL
 * 2) Load da BUSINESS_KV
 * 3) BusinessSchema.parse (verità)
 * 4) Public guard (status)
 * 5) Normalizzazione → DTO pubblico
 *
 * KV:
 * - BUSINESS_KV
 * - Key: BUSINESS:{id}
 *
 * CONNECT POINTS:
 * - backend/src/index.ts → GET /api/business/public/:id
 * - FE: pagina pubblica business
 * ======================================================
 */

import type { Env } from "../../../types/env";

import { BusinessSchema } 
  from "../../../domains/business/business.schema";

import { normalizeBusiness } from "../../../domains/business/business.internal.normalizer";
import { BusinessInternalDTO } from "../../../domains/business/business.internal.dto";
import { BUSINESS_KEY } from "../../../lib/kv";
import { json } from "../../../domains/auth/route/helper/https";


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
  const publicDTO = normalizeBusiness(internalDTO);
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
