// ======================================================
// POLICY — ADMIN / REGISTER
// ======================================================
//
// RUOLO:
// - Registrazione nuova versione policy
// - Impostazione puntatore LATEST
//
// INVARIANTI:
// - type + scope + version obbligatori
// - overwrite version consentito SOLO da admin
// ======================================================

import type { Env } from "../../../types/env";
import { RegisterPolicySchema } from "../../legal/policy/schema/register.policy.schema";
import {
  POLICY_VERSION_KEY,
  POLICY_LATEST_KEY,
} from "../../legal/policy/keys";
import { json } from "@domains/auth/route/helper/https";

export async function registerPolicyVersion(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = RegisterPolicySchema.parse(await request.json());
  } catch {
    return json(
      { ok: false, error: "INVALID_BODY" },
      request,
      env,
      400
    );
  }

  const { type, scope, version, content } = body;

  // checksum contenuto
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(
      typeof content === "string"
        ? content
        : JSON.stringify(content)
    )
  );

  const checksum = [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  const record = {
    type,
    scope,
    version,
    content,
    checksum,
    createdAt: new Date().toISOString(),
  };

  await env.POLICY_KV.put(
    POLICY_VERSION_KEY(type, scope, version),
    JSON.stringify(record)
  );

  await env.POLICY_KV.put(
    POLICY_LATEST_KEY(type, scope),
    version
  );

  return json(
    { ok: true, type, scope, version, checksum },
    request,
    env
  );
}