// ======================================================
// BE || BUSINESS || DRAFT || LIST GET
// GET /api/business/draft/list-get
// ======================================================
//
// RUOLO:
// - Elenca i BusinessDraft COMPLETI dell’utente
// - Usato da Dashboard / Workspace
//
// INVARIANTI:
// - Auth obbligatoria
// - READ ONLY
// - Draft incompleti ESCLUSI
// ======================================================

import type { Env } from "../../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

/* =========================
   DTO
========================= */
type BusinessDraftListItemDTO = {
  businessDraftId: string;
  configurationId: string;
  businessName: string;
  status: string;        // status della CONFIGURATION
  complete: boolean;
  createdAt: string;
  updatedAt: string;
};

type ConfigurationIndexItem = {
  businessDraftId?: string;
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
     2️⃣ LOAD USER CONFIGURATIONS INDEX
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
    const configuration = await env.CONFIGURATION_KV.get(
      `CONFIGURATION:${configurationId}`,
      "json"
    ) as ConfigurationIndexItem | null;

    if (!configuration?.businessDraftId) continue;

    const rawDraft = await env.BUSINESS_KV.get(
      `BUSINESS_DRAFT:${configuration.businessDraftId}`
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
      businessDraftId: configuration.businessDraftId,
      configurationId,
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
