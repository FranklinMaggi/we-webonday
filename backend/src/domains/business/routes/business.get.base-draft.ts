// ======================================================
// BE || BUSINESS || GET BASE DRAFT (FASE 1)
// GET /api/business/draft?configurationId=
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Recupera il BusinessDraft associato a una Configuration
// - Usato per il PREFILL dello step Business nel configuratore
//
// MODELLO DATI (POST-FASE-1):
// - BusinessDraft è OWNED dalla Configuration
// - ID BusinessDraft === configurationId
// - KV key: BUSINESS_DRAFT:{configurationId}
//
// INVARIANTI:
// - Auth obbligatoria
// - Read-only
// - Backend = source of truth
//
// PERCHÉ:
// - Evita lookup indiretti
// - Semplifica preview e flusso guidato
// - Elimina mismatch concettuali tra Draft e Configuration
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import type { ConfigurationDTO } from "@domains/configuration/schema/configuration.schema";

export async function getBusinessDraft(
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
     (SOURCE OF TRUTH)
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

  /* =====================
     4️⃣ OWNERSHIP CHECK
  ====================== */
  if (configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     5️⃣ LOAD BUSINESS DRAFT
     (OWNED BY CONFIGURATION)
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    `BUSINESS_DRAFT:${configurationId}`
  );

  // Draft non ancora creato → flusso valido
  if (!raw) {
    return json(
      { ok: true, draft: null },
      request,
      env
    );
  }

  /* =====================
     6️⃣ VALIDATE (DOMAIN)
  ====================== */
  let draft;
  try {
    draft = BusinessDraftSchema.parse(
      JSON.parse(raw)
    );
  } catch {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_CORRUPTED" },
      request,
      env,
      500
    );
  }

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, draft },
    request,
    env
  );
}