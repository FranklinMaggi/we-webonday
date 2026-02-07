// ======================================================
// BE || BUSINESS || LIST (CANONICAL)
// GET /api/user/business/list
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Elenca TUTTI i Business dell’utente
// - Usato da Sidebar, Dashboard, Workspace
//
// MODELLO CANONICO:
// - Business è OWNED dalla Configuration
// - Business ID === configurationId
// - KV key: BUSINESS:{configurationId}
// - Stato reale = business.verification
//
// INVARIANTI:
// - Auth obbligatoria
// - Read-only
// - Nessuna derive su Configuration.status
// - Backend = source of truth
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { BUSINESS_KEY } from "../keys";

/* =========================
   DTO (OUTPUT)
========================= */
type BusinessListItemDTO = {
  configurationId: string;
  businessId: string; // === configurationId
  businessName: string;
  verification: "DRAFT" | "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
};

/* ======================================================
   HANDLER
====================================================== */
export async function listMyBusinesses(
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
     3️⃣ RESOLVE BUSINESS (CONFIG-SCOPED)
  ====================== */
  const items: BusinessListItemDTO[] = [];

  for (const configurationId of userConfigIds) {
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

    // guard minimo di dominio
    if (!business.verification) continue;

    items.push({
      configurationId,
      businessId: configurationId,
      businessName: business.businessName ?? "Attività",
      verification: business.verification,
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
