// ======================================================
// BE || BUSINESS || GET BASE (STATE-AWARE)
// GET /api/business/draft?configurationId=
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Recupera il Business associato a una Configuration
// - Usato per PREFILL dello step Business (FASE 1)
//
// MODELLO CANONICO:
// - Business è OWNED dalla Configuration
// - Business ID === configurationId
// - KV key: BUSINESS:{configurationId}
// - Draft = STATO (verification === "DRAFT")
// - Completezza = businessDataComplete === true
//
// INVARIANTI:
// - Auth obbligatoria
// - Read-only
// - Ownership via Configuration
// - Backend = source of truth
//
// NOTE:
// - userId è DERIVATO (audit / lookup owner)
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

import { BusinessSchema } from "../schema/business.schema";
import type { ConfigurationDTO } from "@domains/configuration/schema/configuration.schema";
import { BUSINESS_KEY } from "../keys";

export async function getBusiness(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ INPUT
  ====================== */
  const configurationId = new URL(request.url)
    .searchParams.get("configurationId");

  if (!configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
     (OWNERSHIP — SOURCE OF TRUTH)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as ConfigurationDTO | null;

  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  if (configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ LOAD BUSINESS
     (STATE-BASED)
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    BUSINESS_KEY(configurationId)
  );

  // Business non ancora creato → flusso valido
  if (!raw) {
    return json(
      {
        ok: true,
        business: null,
        userId: configuration.userId, // 🔑 per lookup Owner
      },
      request,
      env
    );
  }

  /* =====================
     5️⃣ VALIDATE (FASE 1)
  ====================== */
  let business;
  try {
    business = BusinessSchema.parse(
      JSON.parse(raw)
    );
  } catch {
    return json(
      { ok: false, error: "BUSINESS_CORRUPTED" },
      request,
      env,
      500
    );
  }

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      business,
      userId: business.ownerUserId,
      draft: {
        businessDraftId: business.id,
    
        businessName: business.businessName,
        solutionId: business.solutionId,
        productId: business.productId,
    
        openingHours: business.openingHours,
    
        contact: business.contact,
        address: business.address,
        businessDescriptionText: business.businessDescriptionText,
        businessDescriptionTags: business.businessDescriptionTags,
        businessServiceTags: business.businessServiceTags,
      },
    },
    request,
    env
  );
}
