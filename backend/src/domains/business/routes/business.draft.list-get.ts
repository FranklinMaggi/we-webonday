// ======================================================
// BE || BUSINESS || DRAFT || LIST (FASE 1)
// GET /api/business/draft/list-get
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Elenca i BusinessDraft COMPLETI dell’utente
// - Usato da Dashboard e Workspace
//
// MODELLO DATI (POST-FASE-1):
// - BusinessDraft è OWNED dalla Configuration
// - ID BusinessDraft === configurationId
// - KV key: BUSINESS_DRAFT:{configurationId}
//
// INVARIANTI:
// - Auth obbligatoria
// - Read-only
// - Draft incompleti esclusi
// - Backend = source of truth
//
// PERCHÉ:
// - Evita join artificiali
// - Riduce ambiguità Draft / Configuration
// - Allinea FE e BE sullo stesso identificatore
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

/* =========================
   DTO (OUTPUT)
========================= */
type BusinessDraftListItemDTO = {
  configurationId: string;
  businessDraftId: string; // alias legacy (=== configurationId)
  businessName: string;
  status: string;
  complete: true;
  createdAt: string;
  updatedAt: string;
};

type ConfigurationIndexItem = {
  status?: string;
};

/* ======================================================
   HANDLER
====================================================== */
export async function listAllBusinessDrafts(
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
     3️⃣ RESOLVE DRAFTS
  ====================== */
  const items: BusinessDraftListItemDTO[] = [];

  for (const configurationId of userConfigIds) {
    /* --- load configuration (status only) --- */
    const configuration = await env.CONFIGURATION_KV.get(
      `CONFIGURATION:${configurationId}`,
      "json"
    ) as ConfigurationIndexItem | null;

    if (!configuration) continue;

    /* --- load business draft (owned by configuration) --- */
    const rawDraft = await env.BUSINESS_KV.get(
      `BUSINESS_DRAFT:${configurationId}`
    );

    if (!rawDraft) continue;

    let draft: any;
    try {
      draft = JSON.parse(rawDraft);
    } catch {
      // draft corrotto → ignorato
      continue;
    }

    /* =====================
       DOMAIN GUARD
    ====================== */
    if (draft.complete !== true) continue;

    items.push({
      configurationId,
      businessDraftId: configurationId, // alias legacy FE
      businessName: draft.businessName ?? "Attività",
      status: configuration.status ?? "UNKNOWN",
      complete: true,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
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