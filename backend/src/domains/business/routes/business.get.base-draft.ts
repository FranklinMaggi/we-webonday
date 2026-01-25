// ======================================================
// BE || BUSINESS || GET BASE DRAFT
// GET /api/business/draft?configurationId=
// ======================================================
//
// RUOLO:
// - Recupera il BusinessDraft associato a una Configuration
// - Usato per PREFILL dello step Business
//
// INVARIANTI:
// - Auth obbligatoria
// - Read-only
// - Backend = source of truth
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { BusinessDraftSchema } from "../schema/business.draft.schema";

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
  ) as {
    businessDraftId?: string;
    userId?: string;
  } | null;

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

  if (!configuration.businessDraftId) {
    return json(
      { ok: true, draft: null },
      request,
      env
    );
  }

  /* =====================
     5️⃣ LOAD BUSINESS DRAFT
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    `BUSINESS_DRAFT:${configuration.businessDraftId}`
  );

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
