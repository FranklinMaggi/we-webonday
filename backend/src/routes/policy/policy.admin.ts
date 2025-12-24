/**
 * ======================================================
 * POLICY — ADMIN SIDE
 * ======================================================
 *
 * RESPONSABILITÀ:
 * - Registrazione nuove versioni di policy
 * - Listing versioni disponibili
 *
 * NOTE:
 * - NON verifica sessione admin (delegato a router/index)
 * - NON è usato dal frontend pubblico
 */

import type { Env } from "../../types/env";
import {
  RegisterPolicySchema,
  POLICY_LATEST_KEY,
  policyVersionKey,
} from "./policy.core";

/* JSON helper locale */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST /api/policy/version/register
 *
 * Registra una nuova policy:
 * - calcola hash del contenuto (audit)
 * - salva la versione
 * - la imposta come latest
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

  const { version, content } = body;

  // Hash per integrità / audit legale
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content)
  );
  const hash = [...new Uint8Array(hashBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const record = {
    version,
    content,
    hash,
    timestamp: new Date().toISOString(),
  };

  await env.POLICY_KV.put(policyVersionKey(version), JSON.stringify(record));
  await env.POLICY_KV.put(POLICY_LATEST_KEY, version);

  return json({ ok: true, version, hash });
}

/**
 * GET /api/policy/version/list
 *
 * Usato da admin / debug / seed.
 */
export async function listPolicyVersions(env: Env): Promise<Response> {
  const list = await env.POLICY_KV.list({ prefix: "POLICY_VERSION:" });

  const versions = list.keys.map((k) =>
    k.name.replace("POLICY_VERSION:", "")
  );

  return json({ ok: true, versions });
}
