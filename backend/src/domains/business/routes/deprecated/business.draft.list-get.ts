// ======================================================
// BE || BUSINESS || DRAFT || LIST GET
// GET /api/business/draft/list-get
// ======================================================

import type { Env } from "../../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

type BusinessDraftListItemDTO = {
  businessDraftId: string;
  configurationId: string;
  businessName: string;
  status: string;
  complete:boolean; 
  createdAt: string;
  updatedAt: string;
};

export async function listAllBusinessDrafts(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const userId = session.user.id;

  /* =====================
     2️⃣ LOAD USER CONFIGURATIONS (INDEX)
  ====================== */
  const userConfigIndex = await env.CONFIGURATION_KV.get(
    `USER_CONFIGURATIONS:${userId}`,
    "json"
  ) as string[] | null;

  if (!Array.isArray(userConfigIndex) || userConfigIndex.length === 0) {
    return json({ ok: true, items: [] }, request, env);
  }

  /* =====================
     3️⃣ RESOLVE BUSINESS DRAFTS
  ====================== */
  const items: BusinessDraftListItemDTO[] = [];

  for (const configurationId of userConfigIndex) {
    const configuration = await env.CONFIGURATION_KV.get(
      `CONFIGURATION:${configurationId}`,
      "json"
    ) as any;

    if (!configuration?.businessDraftId) continue;

    const rawDraft = await env.BUSINESS_KV.get(
      `BUSINESS_DRAFT:${configuration.businessDraftId}`
    );

    if (!rawDraft) continue;

    let draft;
    try {
      draft = JSON.parse(rawDraft);
    } catch {
      continue;
    }
 // 🔒 BLOCCO DOMINIO
 if (draft.complete !== true) continue;

    items.push({
      businessDraftId: configuration.businessDraftId,
      configurationId,
      businessName: draft.businessName ?? "Attività",
      status: configuration.status,
      complete: draft.complete, // ✅ QUI
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
    });
  }

  /* =====================
     4️⃣ RESPONSE
  ====================== */
  return json({ ok: true, items }, request, env);
}
