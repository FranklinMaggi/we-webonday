// ======================================================
// BE || BUSINESS || PREVIEW
// GET /api/business/preview?configurationId=
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Ritorna la preview live del Business
// - Basata esclusivamente su BusinessDraft (+ OwnerDraft)
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { OWNER_DRAFT_KEY } from "@domains/owner/keys";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import { OwnerDraftSchema } from "@domains/owner/schema/owner.draft.schema";
import { mapBusinessPreview } from "../mappers/business.preview.mapper";

export async function getBusinessPreview(
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
     3️⃣ OWNERSHIP (CONFIG)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

  if (!configuration || configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ LOAD BUSINESS DRAFT
  ====================== */
  const rawDraft = await env.BUSINESS_KV.get(
    `BUSINESS_DRAFT:${configurationId}`
  );

  if (!rawDraft) {
    // preview vuota → flusso valido
    return json(
      {
        ok: true,
        preview: {
          configurationId,
          complete: false,
        },
      },
      request,
      env
    );
  }

  const businessDraft =
    BusinessDraftSchema.parse(JSON.parse(rawDraft));

  /* =====================
     5️⃣ LOAD OWNER DRAFT (OPTIONAL)
  ====================== */
  let ownerDraft;
  const rawOwner = await env.BUSINESS_KV.get(
    OWNER_DRAFT_KEY(configurationId),
  );

  if (rawOwner) {
    ownerDraft =
      OwnerDraftSchema.parse(JSON.parse(rawOwner));
  }

  /* =====================
     6️⃣ MAP → PREVIEW
  ====================== */
  const preview = mapBusinessPreview(
    businessDraft,
    ownerDraft
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, preview },
    request,
    env
  );
}