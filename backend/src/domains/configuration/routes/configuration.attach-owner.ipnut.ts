// ======================================================
// BE || CONFIGURATION || ATTACH OWNER
// POST /api/business/configuration/attach-owner
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

/* ======================================================
   KV KEYS — PACK
====================================================== */
import { configurationKey } from "@domains/configuration/keys.ts";
import { OWNER_DRAFT_KEY } from "@domains/owner/keys";
export interface AttachOwnerToConfigurationInputDTO {
  configurationId: string;
}

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

  const configurationId = input.configurationId;

  /* =====================
     3️⃣ LOAD CONFIGURATION
  ====================== */
  const configRaw = await env.CONFIGURATION_KV.get(
    configurationKey(configurationId)
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

  if (configuration.userId !== session.user.id) {
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
    OWNER_DRAFT_KEY(configurationId)
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
     5️⃣ ATTACH OWNER (IDEMPOTENTE)
  ====================== */
  const now = new Date().toISOString();

  const updatedConfiguration = {
    ...configuration,
    ownerDraftId: configuration.ownerDraftId ?? configurationId,
    ownerUserId: configuration.ownerUserId ?? session.user.id,
    status: "CONFIGURATION_IN_PROGRESS",
    updatedAt: now,
  };

  await env.CONFIGURATION_KV.put(
    configurationKey(configurationId),
    JSON.stringify(updatedConfiguration)
  );

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      configurationId,
      status: updatedConfiguration.status,
    },
    request,
    env
  );
}