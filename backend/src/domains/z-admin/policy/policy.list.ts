// ======================================================
// POLICY — ADMIN / LIST
// ======================================================
//
// RUOLO:
// - Elenco versioni policy registrate
//
// NOTA:
// - Usato solo da Admin UI
// ======================================================

import type { Env } from "../../../types/env";
import { json } from "@domains/auth/route/helper/https";

export async function listPolicyVersions(
  request: Request,
  env: Env
): Promise<Response> {
  const { keys } = await env.POLICY_KV.list({
    prefix: "POLICY:",
  });

  const items = await Promise.all(
    keys.map(k => env.POLICY_KV.get(k.name, "json"))
  );

  return json(
    { ok: true, items: items.filter(Boolean) },
    request,
    env
  );
}