/**
 * ======================================================
 * POLICY — USER SIDE
 * ======================================================
 *
 * RESPONSABILITÀ:
 * - Esporre la policy attiva
 * - Registrare accettazione policy
 * - Verificare stato accettazione
 *
 * PRINCIPI:
 * - L’utente è SEMPRE derivato dalla sessione
 * - Il client NON invia userId
 * - La policy è BLOCCANTE per ordini e pagamenti
 */

import type { Env } from "../../types/env";
import {
  AcceptPolicySchema,
  policyAcceptanceKey,
  policyVersionKey,
  getLatestPolicyVersion,
} from "./policy.core";
import { requireUser,getUserFromSession
 } from "../../lib/auth/session";


/* JSON helper locale */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/policy/version/latest
 *
 * Usata dal frontend per mostrare il testo policy.
 */
export async function getLatestPolicy(
  env: Env
): Promise<Response> {
  const latest = await getLatestPolicyVersion(env);
  if (!latest) {
    return json({ ok: true, hasPolicy: false });
  }

  const data = await env.POLICY_KV.get(policyVersionKey(latest));
  if (!data) {
    return json({ ok: false, error: "LATEST_POLICY_MISSING" }, 500);
  }

  return new Response(data, {
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST /api/policy/accept
 *
 * Registra accettazione policy:
 * - solo utente loggato
 * - solo policy latest
 */
export async function acceptPolicy(
  request: Request,
  env: Env
): Promise<Response> {
   const session = await requireUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  const user = session.user;

  let body;
  try {
    body = AcceptPolicySchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_INPUT" }, 400);
  }

  const latest = await getLatestPolicyVersion(env);
  if (!latest) {
    return json({ ok: false, error: "NO_POLICY_AVAILABLE" }, 500);
  }

  if (body.policyVersion !== latest) {
    return json({ ok: false, error: "POLICY_OUTDATED" }, 409);
  }

  await env.POLICY_KV.put(
    policyAcceptanceKey(user.id, latest),
    JSON.stringify({ acceptedAt: new Date().toISOString() })
  );

  return json({ ok: true });
}

/**
 * GET /api/policy/status
 *
 * Ritorna se l’utente corrente ha accettato la policy latest.
 */
export async function getPolicyStatus(
  request: Request,
  env: Env
): Promise<Response> {
  const user = await getUserFromSession(request, env);
  if (!user) {
    return json({ accepted: false });
  }

  const latest = await getLatestPolicyVersion(env);
  if (!latest) {
    return json({ accepted: false });
  }

  const stored = await env.POLICY_KV.get(
    policyAcceptanceKey(user.id, latest)
  );

  if (!stored) {
    return json({ accepted: false, policyVersion: latest });
  }

  return json({
    accepted: true,
    policyVersion: latest,
    ...JSON.parse(stored),
  });
}
