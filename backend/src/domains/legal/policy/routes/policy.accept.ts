/**
 * ======================================================
 * POLICY — USER / VISITOR SIDE// policy.accept.ts
 * ======================================================
 *
 * RUOLO:

 * - Accettazione policy (USER oggi, VISITOR domani)

 *
 * INVARIANTI:
 * - Backend = source of truth
 * - type + scope SEMPRE obbligatori
 * - Nessuna policy implicita
 * - Versione SEMPRE verificata contro latest
 *
 * NOTE PORTABILITÀ:
 * - subjectId astratto (userId | visitorId)
 * - KV keys centralizzate in keys.ts
 */

import type { Env } from "../../../../types/env";

import { POLICY_LATEST_KEY, POLICY_ACCEPTANCE_KEY, } from "../keys";

import { AcceptPolicySchema} from "../schema/acceptance.policy.schema";

import {requireAuthUser} from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
/* ======================================================
   ACCEPT — POLICY (USER ONLY, OGGI)
====================================================== */
/**
 * POST /api/policy/accept
 *
 * BODY:
 * - type
 * - scope
 * - policyVersion
 *
 * INVARIANTE:
 * - solo USER autenticato
 * - versione DEVE essere latest
 *
 * FUTURO:
 * - visitorId al posto di userId
 */


export async function acceptPolicy(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  let body;
  try {
    body = AcceptPolicySchema.parse(await request.json());
  } catch {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  const { type, scope, policyVersion } = body;

  const latest = await env.POLICY_KV.get(
    POLICY_LATEST_KEY(type, scope)
  );

  if (!latest) {
    return json(
      { ok: false, error: "NO_POLICY_AVAILABLE" },
      request,
      env,
      500
    );
  }

  if (policyVersion !== latest) {
    return json(
      { ok: false, error: "POLICY_OUTDATED" },
      request,
      env,
      409
    );
  }

  await env.POLICY_KV.put(
    POLICY_ACCEPTANCE_KEY(
      session.user.id,
      type,
      scope,
      latest
    ),
    JSON.stringify({ acceptedAt: new Date().toISOString() })
  );

  return json({ ok: true }, request, env);
}