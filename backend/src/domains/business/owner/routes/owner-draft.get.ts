// ======================================================
// BE || BUSINESS || OWNER || GET DRAFT
// GET /api/owner/get-draft
// ======================================================
//
// RUOLO:
// - Recupera l’OwnerDraft dell’utente autenticato
//
// INVARIANTI:
// - Auth HARD obbligatoria
// - 1 OwnerDraft per user
// - Read only
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../../types/env";
import { OwnerDraftSchema } from "../shcema/owner.draft.schema";
import type {
  OwnerDraftReadDTO,
} from "../DataTransferObject/output/busienss.owner.output.dto";

// ======================================================
// KV
// ======================================================
const OWNER_DRAFT_KEY = (userId: string) =>
  `BUSINESS_OWNER_DRAFT:${userId}`;

// ======================================================
// HANDLER
// ======================================================
export async function getBusinessOwnerDraft(
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

  const userId = session.user.id;
  const key = OWNER_DRAFT_KEY(userId);

  /* =====================
     2️⃣ LOAD OWNER DRAFT
  ====================== */
  const raw = await env.BUSINESS_KV.get(key);

  if (!raw) {
    return json(
      { ok: true, owner: null },
      request,
      env
    );
  }

  /* =====================
     3️⃣ VALIDATE
  ====================== */
  const parsed = OwnerDraftSchema.safeParse(
    JSON.parse(raw)
  );

  if (!parsed.success) {
    return json(
      { ok: false, error: "INVALID_OWNER_DRAFT" },
      request,
      env,
      500
    );
  }

  const ownerDraft = parsed.data;

  /* =====================
     4️⃣ MAP → READ DTO
  ====================== */
  const owner: OwnerDraftReadDTO = {
    id: ownerDraft.id,
    firstName: ownerDraft.firstName,
    lastName: ownerDraft.lastName,
    birthDate: ownerDraft.birthDate,
    contact: ownerDraft.contact,
    source: ownerDraft.source,
    privacy:ownerDraft.privacy,
    verified: ownerDraft.verified ,
    complete: ownerDraft.complete,
  };

  /* =====================
     5️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, owner },
    request,
    env
  );
}
