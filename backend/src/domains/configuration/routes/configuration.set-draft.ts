// ======================================================
// BE || CONFIGURATION — SET DRAFT
// ======================================================
//
// RUOLO:
// - Riporta una Configuration allo stato DRAFT
// - Consente la riapertura del configurator
//
// INVARIANTI:
// - Auth obbligatoria
// - Configuration = source of truth
// - Operazione IDEMPOTENTE
// - NON modifica BusinessDraft
// - NON modifica OwnerDraft
//
// FLOW:
// Business View → "Modifica sito" → SET DRAFT → WORKSPACE
// ======================================================

import type { Env } from "../../../types/env";
import type { ConfigurationDTO } from "../schema/configuration.schema";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

// =========================
// INPUT DTO
// =========================
type SetDraftInputDTO = {
  configurationId: string;
};

// =========================
// KV HELPERS
// =========================
const configurationKey = (id: string) =>
  `CONFIGURATION:${id}`;

// ======================================================
// HANDLER
// ======================================================
export async function setConfigurationDraft(
  request: Request,
  env: Env
) {
  // =========================
  // AUTH
  // =========================
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  // =========================
  // INPUT
  // =========================
  let body: SetDraftInputDTO;
  try {
    body = await request.json();
  } catch {
    return json(
      { ok: false, error: "INVALID_JSON" },
      request,
      env,
      400
    );
  }

  if (!body?.configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_MISSING" },
      request,
      env,
      400
    );
  }

  // =========================
  // LOAD CONFIGURATION
  // =========================
  const configuration =
    (await env.CONFIGURATION_KV.get(
      configurationKey(body.configurationId),
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

  // =========================
  // GUARD — IDEMPOTENZA
  // =========================
  if (configuration.status === "DRAFT") {
    return json(
      {
        ok: true,
        configurationId: configuration.id,
        status: "DRAFT",
        alreadyDraft: true,
      },
      request,
      env
    );
  }
  // =========================
  // SET DRAFT
  // =========================
  const now = new Date().toISOString();

  const updated: ConfigurationDTO = {
    ...configuration,
    status: "CONFIGURATION_IN_PROGRESS",
    updatedAt: now,
  };

  await env.CONFIGURATION_KV.put(
    configurationKey(body.configurationId),
    JSON.stringify(updated)
  );


  // =========================
  // RESPONSE
  // =========================
  return json(
    {
      ok: true,
      configurationId: configuration.id,
      status: "CONFIGURATION_IN_PROGRESS",
    },
    request,
    env
  );
}
