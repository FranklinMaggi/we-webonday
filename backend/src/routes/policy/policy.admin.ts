// ======================================================
// POLICY — ADMIN
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Registrazione nuove versioni di policy
// - Impostazione latest per scope
//
// INVARIANTI:
// - Scope obbligatorio
// - Version overwrite consentito (seed controllato)
//
// ======================================================

import type { Env } from "../../types/env";
import {
  RegisterPolicySchema,
  policyLatestKey,
  policyVersionKey,
} from "./policy.core";

/* JSON helper */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST /api/policy/version/register
 */
export async function registerPolicyVersion(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = RegisterPolicySchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_BODY" }, 400);
  }

  const { scope, version, content } = body;

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(
      typeof content === "string"
        ? content
        : JSON.stringify(content)
    )
  );

  const hash = [...new Uint8Array(hashBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const record = {
    scope,
    version,
    content,
    hash,
    timestamp: new Date().toISOString(),
  };

  await env.POLICY_KV.put(
    policyVersionKey(scope, version),
    JSON.stringify(record)
  );

  await env.POLICY_KV.put(policyLatestKey(scope), version);

  return json({ ok: true, scope, version, hash });
}
/**
 * GET /api/policy/version/list
 */
export async function listPolicyVersions(env: Env): Promise<Response> {
  const { keys } = await env.POLICY_KV.list({
    prefix: "POLICY_VERSION:",
  });

  const items = await Promise.all(
    keys.map(k => env.POLICY_KV.get(k.name, "json"))
  );

  return new Response(
    JSON.stringify({ ok: true, items: items.filter(Boolean) }),
    { headers: { "Content-Type": "application/json" } }
  );
}
