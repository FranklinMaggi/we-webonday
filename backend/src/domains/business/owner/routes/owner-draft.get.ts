// BE || BUSINESS || OWNER || GET DRAFT

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../../types/env";
import { OwnerDraftSchema } from "../shcema/owner.draft.schema";
import { assertConfigurationOwnershipByBusinessDraft } from
  "@domains/business/lib/assertConfigurationOwnershipByBusinessDraft";


import type { OwnerDraftReadDTO } from "../DataTransferObject/output/busienss.owner.output.dto";
const OWNER_DRAFT_KEY = (businessDraftId: string) =>
  `BUSINESS_OWNER_DRAFT:${businessDraftId}`;

export async function getBusinessOwnerDraft(
  request: Request,
  env: Env
): Promise<Response> {

  function normalizeBusinessDraftId(id: string) {
    return id.includes(":") ? id.split(":").pop()! : id;
  }
  /* =====================

     AUTH
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
     PARAMS
  ====================== */
  const url = new URL(request.url);
  const rawbusinessDraftId =
    url.searchParams.get("businessDraftId");

  if (!rawbusinessDraftId) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_ID_REQUIRED" },
      request,
      env,
      400
    );
  }
  const businessDraftId =
  normalizeBusinessDraftId(rawbusinessDraftId);
  /* =====================
     OWNERSHIP
  ====================== */
  try {
    await assertConfigurationOwnershipByBusinessDraft(
      env,
      businessDraftId,
      session.user.id
    );
  } catch (err: any) {
    return json(
      { ok: false, error: err.message },
      request,
      env,
      err.message === "BUSINESS_DRAFT_NOT_FOUND"
        ? 404
        : 403
    );
  }
  

 /* =====================
   LOAD OWNER DRAFT
===================== */
const raw = await env.BUSINESS_KV.get(
  OWNER_DRAFT_KEY(businessDraftId)
);

if (!raw) {
  return json({ ok: true, owner: null }, request, env);
}

let ownerDraft: OwnerDraftReadDTO;

try {
  const parsed = OwnerDraftSchema.safeParse(JSON.parse(raw));

  if (!parsed.success) {
    return json(
      { ok: false, error: "INVALID_OWNER_DRAFT" },
      request,
      env,
      500
    );
  }

  let OwnerDraft= parsed.data;
} catch {
  return json(
    { ok: false, error: "CORRUPTED_OWNER_DRAFT" },
    request,
    env,
    500
  );
}

  /* =====================
     MAP → READ DTO
  ====================== */
  const owner: OwnerDraftReadDTO = {
    id: ownerDraft.id,
    firstName: ownerDraft.firstName,
    lastName: ownerDraft.lastName,
    birthDate: ownerDraft.birthDate,
    contact: ownerDraft.contact,
    source: ownerDraft.source,
    verified: ownerDraft.verified,
    complete: ownerDraft.complete,
  };

  return json(
    { ok: true, owner },
    request,
    env
  );
}
