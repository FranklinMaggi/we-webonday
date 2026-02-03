// ======================================================
// BE || CONFIGURATION || ATTACH OWNER (DERIVATION POINT)
// ======================================================
//
// RUOLO:
// - Punto di derivazione dello stato `complete`
// - NON finalizza
// - NON governa sidebar
//
// INVARIANTI:
// - complete è DERIVATO, mai deciso
// - Configuration è read/write SOLO qui
// - Draft sono source of truth
// - Operazione IDEMPOTENTE
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { CONFIGURATION_KEY } from "@domains/configuration/keys";
import { OWNER_DRAFT_KEY } from "@domains/owner/keys";
import { BUSINESS_DRAFT_KEY } from "@domains/business/keys";

import type { ConfigurationDTO } from "@domains/configuration/schema/configuration.schema";
import type { BusinessDraftBaseReadDTO } from "@domains/business/DataTransferObject/output/business.draft.read.dto";
import type { OwnerDraftReadDTO } from "@domains/owner/DataTransferObject/output/business.owner.output.dto";

/* ======================================================
   INPUT DTO
====================================================== */
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
  let input: AttachOwnerToConfigurationInputDTO;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_BODY" }, request, env, 400);
  }

  const { configurationId } = input ?? {};
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
     (OWNERSHIP ONLY)
  ====================== */
  const configuration =
    (await env.CONFIGURATION_KV.get(
      CONFIGURATION_KEY(configurationId),
      "json"
    )) as ConfigurationDTO | null;

  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  if (configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ LOAD DRAFTS
     (SOURCE OF TRUTH)
  ====================== */
  const ownerDraft =
    (await env.BUSINESS_KV.get(
      OWNER_DRAFT_KEY(configurationId),
      "json"
    )) as OwnerDraftReadDTO | null;

  const businessDraft =
    (await env.BUSINESS_KV.get(
      BUSINESS_DRAFT_KEY(configurationId),
      "json"
    )) as BusinessDraftBaseReadDTO | null;

  if (!ownerDraft || !businessDraft) {
    return json(
      { ok: false, error: "DRAFTS_NOT_FOUND" },
      request,
      env,
      409
    );
  }

  /* =====================
     5️⃣ DERIVE COMPLETE
     (PURE DERIVATION)
  ====================== */
  const complete =
    ownerDraft.complete === true &&
    businessDraft.complete === true;

  const now = new Date().toISOString();

  /* =====================
     6️⃣ UPDATE CONFIGURATION
     (IDEMPOTENTE)
  ====================== */
  await env.CONFIGURATION_KV.put(
    CONFIGURATION_KEY(configurationId),
    JSON.stringify({
      ...configuration,
      complete,
      updatedAt: now,
    })
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      configurationId,
      complete,
    },
    request,
    env
  );
}