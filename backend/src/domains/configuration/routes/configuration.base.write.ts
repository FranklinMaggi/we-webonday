// ======================================================
// BE || CONFIGURATION — CREATE BASE (BOOTSTRAP)
// ======================================================
//
// RUOLO:
// - Creare una Configuration BASE (workspace vuoto)
// - Primo punto di ingresso post-login
//
// INVARIANTI:
// - NON legge Business
// - NON scrive Business
// - NON gestisce contenuti
// - NON gestisce pricing
// - Backend = source of truth
//
// FLOW:
// BuyFlow → LOGIN → CREATE BASE → DASHBOARD
// ======================================================

import { ConfigurationBaseInputSchema } from "../DataTransferObgject/inputDaUser/configuration.base.input";
import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import {
  buildConfigurationId,
  configurationKey,
  userConfigurationsKey,
} from "../index";
import type { ConfigurationDTO } from "../schema/configuration.schema";

export async function createConfigurationBase(
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
  const body = ConfigurationBaseInputSchema.parse(
    await request.json()
  );

  // =========================
  // BUILD CONFIGURATION ID
  // =========================
  const configurationId = buildConfigurationId(
    body.businessName,
    body.solutionId
  );

  const key = configurationKey(configurationId);

  // =========================
  // GUARD — IDEMPOTENZA
  // =========================
  const existing =
    (await env.CONFIGURATION_KV.get(
      key,
      "json"
    )) as ConfigurationDTO | null;

  if (existing) {
    return json(
      { ok: true, configurationId },
      request,
      env
    );
  }

  // =========================
  // CREATE BASE CONFIGURATION
  // =========================
  const now = new Date().toISOString();

  const configuration: ConfigurationDTO = {
    id: configurationId,
    userId: session.user.id,
    
    solutionId: body.solutionId,
    productId: body.productId,

    options: [],

    data:{},

    status: "DRAFT",

    createdAt: now,
    updatedAt: now,
    deletedAt:"",
  };

  await env.CONFIGURATION_KV.put(
    key,
    JSON.stringify(configuration)
  );

  // =========================
  // INDEX USER → CONFIGURATIONS
  // =========================
  const listKey = userConfigurationsKey(session.user.id);
  const list: string[] =
    (await env.CONFIGURATION_KV.get(
      listKey,
      "json"
    )) ?? [];

  if (!list.includes(configurationId)) {
    list.push(configurationId);
    await env.CONFIGURATION_KV.put(
      listKey,
      JSON.stringify(list)
    );
  }

  // =========================
  // RESPONSE
  // =========================
  return json(
    { ok: true, configurationId },
    request,
    env
  );
}
