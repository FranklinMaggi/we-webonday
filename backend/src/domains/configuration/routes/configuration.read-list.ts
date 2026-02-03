// ======================================================
// BE || routes/configuration/configuration.read-list.ts
// ======================================================
//
// CONFIGURATION — USER SIDE (LIST)
//
// RUOLO:
// - Lista delle Configuration dell’utente loggato
//
// INVARIANTI:
// - User da sessione
// - USER_CONFIGURATIONS_KEY = indice
// - CONFIGURATION_KV = source of truth
// ======================================================

import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import type { Env } from "../../../types/env";

import {
  USER_CONFIGURATIONS_KEY,
  CONFIGURATION_KEY,
} from "../keys";

/* ======================================================
   GET /api/configuration/get-list
====================================================== */
export async function listUserConfigurations(
  request: Request,
  env: Env
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
     2️⃣ LOAD USER INDEX
  ====================== */
  const listKey = USER_CONFIGURATIONS_KEY(
    session.user.id
  );

  const ids: string[] =
    (await env.CONFIGURATION_KV.get(
      listKey,
      "json"
    )) ?? [];

  /* =====================
     3️⃣ LOAD CONFIGURATIONS
  ====================== */
  const items = (
    await Promise.all(
      ids.map((id) =>
        env.CONFIGURATION_KV.get(
          CONFIGURATION_KEY(id),
          "json"
        )
      )
    )
  ).filter(Boolean);

  /* =====================
     4️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      count: items.length,
      items,
    },
    request,
    env
  );
}