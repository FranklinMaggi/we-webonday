// ======================================================
// BE || CONFIGURATION — READ BASE (USER)
// ======================================================
//
// ENDPOINT:
// - GET /api/configuration/base/:id
//
// USO:
// - Dashboard post-login
// - Start configurator
//
// INVARIANTI:
// - Read-only
// - Ownership via session
// - Nessuna mutazione
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { toBaseReadDTO } from "../mappers/configuration.draft.mapper";
import { getConfiguration } from "./configuration.helper-getter";



export async function readConfigurationBase(
  request: Request,
  env: Env,
  id: string
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
     2️⃣ LOAD CONFIGURATION
  ====================== */
  const configuration = await getConfiguration(env, id);
  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     3️⃣ OWNERSHIP
  ====================== */
  if (configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ RESPONSE (BASE DTO)
  ====================== */
  return json(
    {
      ok: true,
      configuration: toBaseReadDTO(configuration),
    },
    request,
    env
  );
}