// ======================================================
// BE || BUSINESS || OWNER || GET DRAFT
// GET /api/owner/get-draft
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { OwnerDraftSchema } from "../schema/owner.draft.schema";
import type { OwnerDraftReadDTO } from
  "../DataTransferObject/output/business.owner.output.dto.ts";
// ======================================================
// BE || OWNER || GET DRAFT (CONFIGURATION-BASED)
// GET /api/owner/get-draft?configurationId=
// ======================================================

const OWNER_DRAFT_KEY = (configurationId: string) =>
  `OWNER_DRAFT:${configurationId}`;

export async function getBusinessOwnerDraft(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const configurationId =
    new URL(request.url).searchParams.get("configurationId");

  if (!configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_REQUIRED" },
      request,
      env,
      400
    );
  }

  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

  if (!configuration || configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  const raw = await env.BUSINESS_KV.get(
    OWNER_DRAFT_KEY(configurationId)
  );

  if (!raw) {
    return json({ ok: true, owner: null }, request, env);
  }

  const parsed = OwnerDraftSchema.parse(JSON.parse(raw));

  const owner: OwnerDraftReadDTO = {
    id: parsed.id,
    configurationId,
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    birthDate: parsed.birthDate,
    address: parsed.address,
    contact: parsed.contact,

    source: parsed.source,
    verification:parsed.verification,
    complete: parsed.complete,
  };

  return json({ ok: true, owner }, request, env);
}