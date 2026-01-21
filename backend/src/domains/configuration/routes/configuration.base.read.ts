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
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { getConfiguration } from "..";
import { toBaseReadDTO } from "../mappers/configuration.draft.mapper";

export async function readConfigurationBase(
  request: Request,
  env: Env,
  id: string
) {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const configuration = await getConfiguration(env, id);
  if (!configuration) {
    return json({ ok: false, error: "NOT_FOUND" }, request, env, 404);
  }

  if (configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  return json(
    {
      ok: true,
      configuration: toBaseReadDTO(configuration),
    },
    request,
    env
  );
}
