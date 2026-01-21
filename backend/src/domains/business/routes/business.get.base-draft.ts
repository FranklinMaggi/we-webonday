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
// - Read only
// - Backend = source of truth
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { BusinessDraftSchema } from "../schema/business.draft.schema";

export async function getBusinessDraft(
  request: Request,
  env: Env
) {
  /* =====================
     AUTH
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
     INPUT
  ====================== */
  const url = new URL(request.url);
  const configurationId =
    url.searchParams.get("configurationId");

  if (!configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     LOAD CONFIGURATION
     (SOURCE OF TRUTH)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as { businessDraftId?: string } | null;

  if (!configuration?.businessDraftId) {
    return json(
      { ok: true, draft: null },
      request,
      env
    );
  }

  const businessDraftId =
    configuration.businessDraftId;

  /* =====================
     LOAD BUSINESS DRAFT
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    `BUSINESS_DRAFT:${businessDraftId}`
  );

  if (!raw) {
    return json(
      { ok: true, draft: null },
      request,
      env
    );
  }

  /* =====================
     VALIDATE (DOMAIN)
  ====================== */
  let draft;
  try {
    draft = BusinessDraftSchema.parse(
      JSON.parse(raw)
    );
  } catch (err) {
    return json(
      {
        ok: false,
        error: "BUSINESS_DRAFT_CORRUPTED",
      },
      request,
      env,
      500
    );
  }

  /* =====================
     RESPONSE
  ====================== */
  return json(
    { ok: true, draft },
    request,
    env
  );
}
