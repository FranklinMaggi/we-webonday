// ======================================================
// BE || CONFIGURATION — DELETE (USER)
// ======================================================
//
// ENDPOINT:
// - DELETE /api/configuration/:id
//
// RUOLO:
// - Elimina definitivamente una Configuration
// - Operazione TECNICA (workspace)
//
// INVARIANTI:
// - Auth obbligatoria
// - Ownership via sessione
// - Configuration = source of truth
// - NON tocca Draft
// - NON valuta complete / status
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

import {
  CONFIGURATION_KEY,
  USER_CONFIGURATIONS_KEY,
} from "../keys";

import { getConfiguration } from "./configuration.helper-getter";

export async function deleteUserConfiguration(
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
     4️⃣ DELETE CONFIGURATION
     (TECHNICAL)
  ====================== */
  await env.CONFIGURATION_KV.delete(
    CONFIGURATION_KEY(id)
  );

  /* =====================
     5️⃣ UPDATE USER INDEX
  ====================== */
  const listKey = USER_CONFIGURATIONS_KEY(
    session.user.id
  );

  const list: string[] =
    (await env.CONFIGURATION_KV.get(
      listKey,
      "json"
    )) ?? [];

  const updatedList = list.filter(
    (configurationId) => configurationId !== id
  );

  await env.CONFIGURATION_KV.put(
    listKey,
    JSON.stringify(updatedList)
  );

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true },
    request,
    env
  );
}