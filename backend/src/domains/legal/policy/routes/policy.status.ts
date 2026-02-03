/**
 * ======================================================
 * POLICY — USER / VISITOR SIDE // policy.status.ts
 * ======================================================
 *
 * RUOLO:

 * - Verifica stato accettazione
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
import { json } from "@domains/auth/route/helper/https";
import type { Env } from "../../../../types/env";
import {POLICY_LATEST_KEY,POLICY_ACCEPTANCE_KEY} from "../keys";
import {getUserFromSession} from "@domains/auth";
/* ======================================================
   STATUS — POLICY ACCEPTANCE
====================================================== */
/**
 * GET /api/policy/status?type=...&scope=...
 *
 * RITORNA:
 * - accepted: boolean
 * - policyVersion?: string
 *
 * NOTE:
 * - se non autenticato → accepted:false
 */
export async function getPolicyStatus(
  request: Request,
  env: Env
): Promise<Response> {
  const user = await getUserFromSession(request, env);
  if (!user) {
    return json({ accepted: false }, request, env);
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const scope = url.searchParams.get("scope");

  if (!type || !scope) {
    return json(
      { ok: false, error: "MISSING_TYPE_OR_SCOPE" },
      request,
      env,
      400
    );
  }

  const latest = await env.POLICY_KV.get(
    POLICY_LATEST_KEY(type as any, scope as any)
  );

  if (!latest) {
    return json({ accepted: false }, request, env);
  }

  const stored = await env.POLICY_KV.get(
    POLICY_ACCEPTANCE_KEY(
      user.id,
      type as any,
      scope as any,
      latest
    )
  );

  if (!stored) {
    return json(
      { accepted: false, policyVersion: latest },
      request,
      env
    );
  }

  return json(
    { accepted: true, policyVersion: latest, ...JSON.parse(stored) },
    request,
    env
  );
}

