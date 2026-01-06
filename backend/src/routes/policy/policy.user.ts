/**
 * ======================================================
 * POLICY — USER SIDE
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Lettura policy attiva (per scope)
 * - Accettazione policy
 * - Verifica stato accettazione
 *
 * INVARIANTI:
 * - User derivato SOLO da sessione
 * - Policy BLOCCANTE per checkout
 */

import type { Env } from "../../types/env";
import {
  AcceptPolicySchema,
  policyAcceptanceKey,
  policyVersionKey,
  getLatestPolicyVersion,
  PolicyScope,
} from "./policy.core";
import {
  requireUser,
  getUserFromSession,
} from "../../lib/auth/session";

/* JSON helper */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/policy/version/latest?scope=checkout
 */
export async function getLatestPolicy(
  request: Request,
  env: Env
): Promise<Response> {
  const scope =
    (new URL(request.url).searchParams.get("scope") as PolicyScope) ??
    "checkout";

  const latest = await getLatestPolicyVersion(env, scope);
  if (!latest) {
    return json({ ok: true, hasPolicy: false });
  }

  const data = await env.POLICY_KV.get(
    policyVersionKey(scope, latest)
  );

  if (!data) {
    return json({ ok: false, error: "LATEST_POLICY_MISSING" }, 500);
  }

  return new Response(data, {
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST /api/policy/accept
 */
export async function acceptPolicy(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  let body;
  try {
    body = AcceptPolicySchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_INPUT" }, 400);
  }

  const { scope, policyVersion } = body;
  const user = session.user;

  const latest = await getLatestPolicyVersion(env, scope);
  if (!latest) {
    return json({ ok: false, error: "NO_POLICY_AVAILABLE" }, 500);
  }

  if (policyVersion !== latest) {
    return json({ ok: false, error: "POLICY_OUTDATED" }, 409);
  }

  await env.POLICY_KV.put(
    policyAcceptanceKey(user.id, scope, latest),
    JSON.stringify({ acceptedAt: new Date().toISOString() })
  );

  return json({ ok: true });
}

/**
 * GET /api/policy/status?scope=checkout
 */
export async function getPolicyStatus(
  request: Request,
  env: Env
): Promise<Response> {
  const user = await getUserFromSession(request, env);
  if (!user) {
    return json({ accepted: false });
  }

  const scope =
    (new URL(request.url).searchParams.get("scope") as PolicyScope) ??
    "checkout";

  const latest = await getLatestPolicyVersion(env, scope);
  if (!latest) {
    return json({ accepted: false });
  }

  const stored = await env.POLICY_KV.get(
    policyAcceptanceKey(user.id, scope, latest)
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
