// ======================================================
// BE || routes/configuration/configuration.user.ts
// ======================================================
//
// CONFIGURATION — USER SIDE
//
// RUOLO:
// - CRUD configurazioni utente (PRE-ORDER / DRAFT)
//
// INVARIANTI:
// - User da sessione
// - Configuration ≠ Order
// - ConfigurationId deterministico
// - CONFIGURATION_KV = source of truth
// ======================================================

import {
    configurationKey,
    userConfigurationsKey,
    getConfiguration } from "../keys.ts"
  
  import { requireAuthUser } from "@domains/auth";
  
  import { json } from "../../../domains/auth/route/helper/https";// ✅ helper allineato

  import type { Env } from "../../../types/env";
  
  /* ======================================================
     GET /api/configuration
     LIST USER CONFIGURATIONS
  ====================================================== */
  export async function listUserConfigurations(
    request: Request,
    env: Env
  ) {
    const session = await requireAuthUser(request, env);
    if (!session) {
      return json(
        { ok: false, error: "UNAUTHORIZED" },
        request,
        env,
        401
      );
    }
  
    const listKey = userConfigurationsKey(session.user.id);
    const ids: string[] =
      (await env.CONFIGURATION_KV.get(listKey, "json")) ?? [];
  
    const items = await Promise.all(
      ids.map((id) =>
        env.CONFIGURATION_KV.get(configurationKey(id), "json")
      )
    );
  
    return json(
      {
        ok: true,
        items: items.filter(Boolean),
      },
      request,
      env
    );
  }
  
  /* ======================================================
     GET /api/configuration/:id
  ====================================================== */
  export async function getUserConfiguration(
    request: Request,
    env: Env,
    id: string
  ) {
    const session = await requireAuthUser(request, env);
    if (!session) {
      return json(
        { ok: false, error: "UNAUTHORIZED" },
        request,
        env,
        401
      );
    }
  
    const configuration = await getConfiguration(env, id);
    if (!configuration) {
      return json(
        { ok: false, error: "NOT_FOUND" },
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
  
    return json(
      { ok: true, configuration },
      request,
      env
    );
  }
  
