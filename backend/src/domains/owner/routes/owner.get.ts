// ======================================================
// BE || OWNER || GET (USER-SCOPED)
// GET /api/owner/get-draft?configurationId=
// ======================================================
//
// RUOLO:
// - Mantiene compatibilità FE (query configurationId)
// - Owner è user-scoped: legge OWNER:{userId}
//
// INVARIANTI:
// - Auth obbligatoria
// - Ownership su Configuration (guard)
// - KV lookup per userId
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { OWNER_KEY } from "../keys";
import { OwnerSchema } from "../schema/owner.schema";
import type { OwnerReadDTO } from "../DataTransferObject/output/owner-read.dto";

export async function getBusinessOwner(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const configurationId = new URL(request.url).searchParams.get("configurationId");
  if (!configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_REQUIRED" },
      request,
      env,
      400
    );
  }

  /* =====================
     OWNERSHIP CONFIG (GUARD)
  ====================== */
  const configuration = (await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  )) as any;

  if (!configuration || configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  /* =====================
     LOAD OWNER (USER-SCOPED)
  ====================== */
  const userId = session.user.id;

  const raw = await env.BUSINESS_KV.get(OWNER_KEY(userId), "json");

  if (!raw) {
    return json({ ok: true, owner: null }, request, env);
  }

  const parsed = OwnerSchema.parse(raw);

  const owner: OwnerReadDTO = {
    id: parsed.id,
    userId:session.user.id,
    firstName: parsed.firstName ?? "",
    lastName: parsed.lastName ?? "",
    birthDate: parsed.birthDate,

    address: parsed.address,
    contact: parsed.contact,

    source: parsed.source,

    verification: parsed.verification ?? "DRAFT",
  };

  return json({ ok: true, owner }, request, env);
}
