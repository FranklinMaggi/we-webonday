// ======================================================
// BE || BUSINESS || OWNER || CONFIRM (DRAFT)
// POST /api/business/owner/confirm
// ======================================================
//
// RUOLO:
// - Congela l'OwnerDraft associato a un BusinessDraft
// - Step OBBLIGATORIO prima della creazione del Business
//
// INVARIANTI:
// - Auth HARD obbligatoria
// - Ownership basata su BusinessDraft
// - verified → true
// - FE NON può forzare dati
// ======================================================

import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../../types/env";

import { assertConfigurationOwnershipByBusinessDraft } from "@domains/business/lib/assertConfigurationOwnershipByBusinessDraft";
import { OwnerDraftSchema } from "../shcema/owner.draft.schema";

// ======================================================
// KV KEYS
// ======================================================
const OWNER_DRAFT_KEY = (userId: string) =>
  `BUSINESS_OWNER_DRAFT:${userId}`;

// ======================================================
// SCHEMAS
// ======================================================
const ConfirmOwnerInputSchema = z.object({
  businessDraftId: z.string().uuid(),
});

const OwnerConfirmedSchema = OwnerDraftSchema.extend({
  verified: z.literal(true),
});
function normalizeBusinessDraftId(id: string) {
  return id.includes(":") ? id.split(":").pop()! : id;
}
// ======================================================
// HANDLER
// ======================================================
export async function confirmBusinessOwner(
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
  let businessDraftId: string;

  try {
    const body = ConfirmOwnerInputSchema.parse(
      await request.json()
    );
    businessDraftId = body.businessDraftId;
  } catch {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ OWNERSHIP (DRAFT)
  ====================== */
  try {
    await assertConfigurationOwnershipByBusinessDraft(
      env,
      businessDraftId,
      session.user.id,
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
     4️⃣ LOAD OWNER DRAFT
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    OWNER_DRAFT_KEY(session.user.id)
  );

  if (!raw) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     5️⃣ CONFIRM
  ====================== */
  let confirmedOwner;
  const draft = JSON.parse(raw);

  if (!draft.complete || !draft.privacy?.accepted) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }
  try {
    confirmedOwner = OwnerConfirmedSchema.parse({
      ...JSON.parse(raw),
      verified: true,
    });
  } catch {
    return json(
      { ok: false, error: "INVALID_OWNER_CONFIRMATION" },
      request,
      env,
      400
    );
  }

  /* =====================
     6️⃣ PERSIST
  ====================== */
  await env.BUSINESS_KV.put(
    OWNER_DRAFT_KEY(session.user.id),
    JSON.stringify(confirmedOwner),
    {
      metadata: {
        type: "business_owner_confirmed",
        businessDraftId,
        ownerUserId: session.user.id,
      },
    }
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessDraftId,
      ownerId: session.user.id,
    },
    request,
    env
  );
}
