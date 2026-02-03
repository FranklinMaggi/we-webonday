// ======================================================
// BE || CONFIGURATION — SET DRAFT (TECHNICAL ONLY)
// ======================================================
//
// RUOLO:
// - Riporta l’utente nel WORKSPACE tecnico
// - NON riapre semanticamente Business / Owner
//
// INVARIANTI:
// - complete è DERIVATO (NON toccato)
// - Draft sono source of truth
// - Operazione IDEMPOTENTE
// ======================================================

import type { Env } from "../../../types/env";
import type { ConfigurationDTO } from "../schema/configuration.schema";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { CONFIGURATION_KEY } from "../keys";

/* =========================
   INPUT DTO
========================= */
type SetDraftInputDTO = {
  configurationId: string;
};

export async function setConfigurationDraft(
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
  let body: SetDraftInputDTO;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, request, env, 400);
  }

  if (!body?.configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_MISSING" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
  ====================== */
  const configuration =
    (await env.CONFIGURATION_KV.get(
      CONFIGURATION_KEY(body.configurationId),
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
     4️⃣ IDEMPOTENCY
  ====================== */
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

  /* =====================
     5️⃣ UPDATE (TECHNICAL)
  ====================== */
  const updated: ConfigurationDTO = {
    ...configuration,
    status: "DRAFT", // ⚠️ solo routing / UI
    updatedAt: new Date().toISOString(),
  };

  await env.CONFIGURATION_KV.put(
    CONFIGURATION_KEY(configuration.id),
    JSON.stringify(updated)
  );

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      configurationId: configuration.id,
      status: "DRAFT",
    },
    request,
    env
  );
}