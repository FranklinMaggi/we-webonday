// ======================================================
// BE || CONFIGURATION || ATTACH OWNER
// POST /api/business/configuration/attach-owner
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

// ======================================================
// DOMAIN || CONFIGURATION || ATTACH OWNER || INPUT
// ======================================================

export interface AttachOwnerToConfigurationInputDTO {
    configurationId: string;
  }
  
// ======================================================
// KV HELPERS
// ======================================================
const OWNER_DRAFT_KEY = (userId: string) =>
  `BUSINESS_OWNER_DRAFT:${userId}`;

const BUSINESS_DRAFT_KEY = (businessDraftId: string) =>
  `BUSINESS_DRAFT:${businessDraftId}`;

const CONFIGURATION_KEY = (configurationId: string) =>
  `CONFIGURATION:${configurationId}`;

// ======================================================
// HANDLER
// ======================================================
export async function attachOwnerToConfiguration(
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
     2️⃣ INPUT
  ====================== */
  const input =
    (await request.json()) as AttachOwnerToConfigurationInputDTO;

  if (!input?.configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
  ====================== */
  const configRaw = await env.CONFIGURATION_KV.get(
    CONFIGURATION_KEY(input.configurationId)
  );

  if (!configRaw) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const configuration = JSON.parse(configRaw);

  if (configuration.userId !== userId) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ LOAD OWNER DRAFT
  ====================== */
  const ownerRaw = await env.BUSINESS_KV.get(
    OWNER_DRAFT_KEY(userId)
  );

  if (!ownerRaw) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const ownerDraft = JSON.parse(ownerRaw);

  if (!ownerDraft.complete) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }

  /* =====================
     5️⃣ LOAD BUSINESS DRAFT
  ====================== */
  const businessRaw = await env.BUSINESS_KV.get(
    BUSINESS_DRAFT_KEY(configuration.businessDraftId)
  );

  if (!businessRaw) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const businessDraft = JSON.parse(businessRaw);

  if (!businessDraft.complete) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }

  /* =====================
     6️⃣ ATTACH OWNER
  ====================== */
  const now = new Date().toISOString();

  const updatedConfiguration = {
    ...configuration,
    ownerUserId: userId,
    status: "READY", // oppure NEXT_STATE
    updatedAt: now,
  };

  await env.CONFIGURATION_KV.put(
    CONFIGURATION_KEY(configuration.id),
    JSON.stringify(updatedConfiguration),
    {
      metadata: {
        ...configuration.metadata,
        ownerAttachedAt: now,
      },
    }
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      configurationId: configuration.id,
      status: updatedConfiguration.status,
    },
    request,
    env
  );
}
