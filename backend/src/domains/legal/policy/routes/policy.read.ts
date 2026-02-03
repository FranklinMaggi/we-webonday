import type { Env } from "../../../../types/env";
import type { PolicyType, PolicyScope } from "../policy.types";
import type { PolicyDocument } from "../policy.types";
import { json } from "@domains/auth/route/helper/https";
import {
  POLICY_LATEST_KEY,
  POLICY_VERSION_KEY,
} from "../keys";

/* ======================================================
   READ — LATEST POLICY (PUBLIC)
====================================================== */
/**
 * GET /api/policy/version/latest?type=...&scope=...
 *
 * ACCESS:
 * - PUBLIC
 * - USER
 * - VISITOR
 *
 * RITORNA:
 * - SOLO policy READABLE normalizzata
 *
 * NON FA:
 * - NON registra consenso
 * - NON assume accettazione
 * - NON espone policy contractual
 */

export async function getLatestPolicy(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);

  const type = url.searchParams.get("type") as PolicyType | null;
  const scope = url.searchParams.get("scope") as PolicyScope | null;

  if (!type || !scope) {
    return json(
      { ok: false, error: "MISSING_TYPE_OR_SCOPE" },
      request,
      env,
      400
    );
  }

  // 1️⃣ recupero versione latest
  const latest = await env.POLICY_KV.get(
    POLICY_LATEST_KEY(type, scope)
  );

  if (!latest) {
    return json(
      { ok: true, hasPolicy: false },
      request,
      env
    );
  }

  // 2️⃣ recupero documento policy
  const raw = await env.POLICY_KV.get(
    POLICY_VERSION_KEY(type, scope, latest)
  );

  if (!raw) {
    return json(
      { ok: false, error: "LATEST_POLICY_MISSING" },
      request,
      env,
      500
    );
  }

  let policy: any;
  try {
    policy = JSON.parse(raw);
  } catch {
    return json(
      { ok: false, error: "INVALID_POLICY_FORMAT" },
      request,
      env,
      500
    );
  }

  // 3️⃣ inferenza renderMode (legacy-safe)
  const renderMode =
    policy.renderMode ??
    (policy.content?.body ? "readable" : "contractual");

  if (renderMode !== "readable") {
    return json(
      { ok: false, error: "POLICY_NOT_READABLE" },
      request,
      env,
      409
    );
  }

  // 4️⃣ normalizzazione content (legacy + canonico)
  const content =
    policy.content?.kind === "readable"
      ? policy.content
      : {
          title: policy.content?.title,
          body: policy.content?.body,
          updatedAt: policy.content?.updatedAt,
        };

  if (!content?.title || !content?.body) {
    return json(
      { ok: false, error: "POLICY_CONTENT_INVALID" },
      request,
      env,
      500
    );
  }

  // 5️⃣ output FE contract (STABILE)
  return json(
    {
      scope: policy.scope,
      version: policy.version,
      content: {
        title: content.title,
        body: content.body,
        updatedAt: content.updatedAt,
      },
    },
    request,
    env
  );
}