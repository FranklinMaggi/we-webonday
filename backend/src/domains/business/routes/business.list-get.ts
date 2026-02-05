// ======================================================
// BE || BUSINESS || LIST (DRAFT STATE)
// GET /api/business/draft/list-get
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Elenca i Business in stato DRAFT COMPLETO dell’utente
// - Usato da Dashboard e Workspace
//
// MODELLO CANONICO:
// - Business è OWNED dalla Configuration
// - Business ID === configurationId
// - KV key: BUSINESS:{configurationId}
// - Draft = STATO (verification === "DRAFT")
//- Completezza = businessDataComplete === true
// INVARIANTI:
// - Auth obbligatoria
// - Read-only
// - Business incompleti esclusi
// - Backend = source of truth
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { BUSINESS_KEY } from "../keys";

/* =========================
   DTO (OUTPUT)
========================= */
type BusinessDraftListItemDTO = {
  configurationId: string;
  businessDraftId: string; // alias legacy (=== configurationId)
  businessName: string;
  status: string;
  businessDataComplete: true;
  createdAt: string;
  updatedAt: string;
};

type ConfigurationIndexItem = {
  status?: string;
};

/* ======================================================
   HANDLER
====================================================== */
export async function listAllBusiness(
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

  const userId = session.user.id;

  /* =====================
     2️⃣ LOAD USER CONFIGURATIONS
     (INDEX = SOURCE OF TRUTH)
  ====================== */
  const userConfigIds = await env.CONFIGURATION_KV.get(
    `USER_CONFIGURATIONS:${userId}`,
    "json"
  ) as string[] | null;

  if (!Array.isArray(userConfigIds) || userConfigIds.length === 0) {
    return json({ ok: true, items: [] }, request, env);
  }

  /* =====================
     3️⃣ RESOLVE BUSINESS
  ====================== */
  const items: BusinessDraftListItemDTO[] = [];

  for (const configurationId of userConfigIds) {
    /* --- load configuration (status only) --- */
    const configuration = await env.CONFIGURATION_KV.get(
      `CONFIGURATION:${configurationId}`,
      "json"
    ) as ConfigurationIndexItem | null;

    if (!configuration) continue;

    /* --- load business (configuration-scoped) --- */
    const rawBusiness = await env.BUSINESS_KV.get(
      BUSINESS_KEY(configurationId)
    );

    if (!rawBusiness) continue;

    let business: any;
    try {
      business = JSON.parse(rawBusiness);
    } catch {
      // business corrotto → ignorato
      continue;
    }

    /* =====================
       DOMAIN GUARD (STATE)
    ====================== */
    if (business.businessDataComplete !== true) continue;

    items.push({
      configurationId,
      businessDraftId: configurationId, // alias legacy FE
      businessName: business.businessName ?? "Attività",
      status: configuration.status ?? "UNKNOWN",
      businessDataComplete: true,
      createdAt: business.createdAt,
      updatedAt: business.updatedAt,
    });
  }

  /* =====================
     4️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, items },
    request,
    env
  );
}
