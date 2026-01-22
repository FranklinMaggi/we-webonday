// ======================================================
// BE || CONFIGURATION — COMMIT
// ======================================================
//
// RUOLO:
// - Finalizza una Configuration
// - Transizione verso stato ACCEPTED
//
// INVARIANTI:
// - Auth obbligatoria
// - Configuration = source of truth
// - BusinessDraft deve esistere
// - Operazione IDEMPOTENTE
//
// FLOW:
// Configurator → Commit → Business visibile in Dashboard
// ======================================================

import type { Env } from "../../../types/env";
import type { ConfigurationDTO } from "../schema/configuration.schema";
import { UserCommitSchema } from "@domains/user/user.commit.schema";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

// =========================
// KV HELPERS
// =========================
const configurationKey = (id: string) =>
  `CONFIGURATION:${id}`;

const userCommitKey = (id: string) =>
  `USER_COMMIT:${id}`;

const userLastCommitKey = (userId: string) =>
  `USER:${userId}:LAST_COMMIT`;

// ======================================================
// DOMAIN FUNCTION
// ======================================================
export async function commitConfiguration(
  env: Env,
  configurationId: string,
  userId: string
): Promise<{ ok: true }> {
  // =========================
  // LOAD CONFIGURATION
  // =========================
  const configuration =
    (await env.CONFIGURATION_KV.get(
      configurationKey(configurationId),
      "json"
    )) as ConfigurationDTO | null;

  if (!configuration) {
    throw new Error("CONFIGURATION_NOT_FOUND");
  }

  if (configuration.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  // =========================
  // STATE GUARD
  // =========================
  if (
    configuration.status !== "BUSINESS_READY" &&
    configuration.status !== "CONFIGURATION_READY" &&
    configuration.status !== "ACCEPTED"
  ) {
    throw new Error("INVALID_STATE_FOR_COMMIT");
  }

  // =========================
  // GUARD — IDEMPOTENZA
  // =========================
  if (configuration.status === "ACCEPTED") {
    return { ok: true };
  }

  if (!configuration.businessDraftId) {
    throw new Error("BUSINESS_DRAFT_ID_MISSING");
  }

  // =========================
  // PROMOTE CONFIGURATION
  // =========================
  const now = new Date().toISOString();

  const updated: ConfigurationDTO = {
    ...configuration,
    status: "ACCEPTED",
    updatedAt: now,
  };

  await env.CONFIGURATION_KV.put(
    configurationKey(configurationId),
    JSON.stringify(updated)
  );

  // =========================
  // USER COMMIT (AUDIT)
  // =========================
  const commitId = crypto.randomUUID();

  const commitRaw = {
    id: commitId,
    userId,
    configurationId,
    businessDraftId: configuration.businessDraftId,
    committedAt: now,
    source: "configuration_commit",
  };

  const parsed = UserCommitSchema.safeParse(commitRaw);
  if (!parsed.success) {
    throw new Error("INVALID_USER_COMMIT");
  }

  await env.ON_USERS_KV.put(
    userCommitKey(parsed.data.id),
    JSON.stringify(parsed.data)
  );

  await env.ON_USERS_KV.put(
    userLastCommitKey(userId),
    parsed.data.id
  );

  return { ok: true };
}

// ======================================================
// ROUTE
// ======================================================
export async function commitConfigurationRoute(
  request: Request,
  env: Env
) {
  // =========================
  // AUTH
  // =========================
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  // =========================
  // INPUT
  // =========================
  let body: { configurationId?: string };
  try {
    body = await request.json();
  } catch {
    return json(
      { ok: false, error: "INVALID_BODY" },
      request,
      env,
      400
    );
  }

  if (!body.configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_MISSING" },
      request,
      env,
      400
    );
  }

  // =========================
  // EXECUTE
  // =========================
  try {
    await commitConfiguration(
      env,
      body.configurationId,
      session.user.id
    );

    return json({ ok: true }, request, env, 200);
  } catch (err: any) {
    return json(
      { ok: false, error: err.message ?? "COMMIT_FAILED" },
      request,
      env,
      400
    );
  }
}
