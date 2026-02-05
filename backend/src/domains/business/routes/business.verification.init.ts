import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { CONFIGURATION_KEY } from "@domains/configuration/keys";
import { initBusinessVerificationInternal } from "./business.verification.internal.init";

/* ======================================================
   INPUT DTO
====================================================== */
type InitBusinessVerificationInputDTO = {
  configurationId: string;
};

/* ======================================================
   HANDLER
====================================================== */
export async function initBusinessVerification(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ INPUT
  ====================== */
  let body: InitBusinessVerificationInputDTO;

  try {
    body = (await request.json()) as InitBusinessVerificationInputDTO;
  } catch {
    return json(
      { ok: false, error: "INVALID_JSON_BODY" },
      request,
      env,
      400
    );
  }

  const { configurationId } = body;

  if (!configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ OWNERSHIP (CONFIGURATION)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    CONFIGURATION_KEY(configurationId),
    "json"
  ) as { userId: string } | null;

  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  if (configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ INTERNAL VERIFICATION
  ====================== */
  const result = await initBusinessVerificationInternal(
    env,
    configurationId,
    session.user.id
  );

  /* =====================
     5️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      result, // "CREATED" | "SKIPPED"
    },
    request,
    env
  );
}