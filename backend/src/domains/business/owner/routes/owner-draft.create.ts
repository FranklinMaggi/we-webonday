// ======================================================
// BE || BUSINESS || OWNER || CREATE DRAFT
// POST /api/owner/create-draft
// ======================================================
//
// RUOLO:
// - Crea o aggiorna un BusinessOwnerDraft
//
// INVARIANTI:
// - Auth HARD obbligatoria
// - 1 OwnerDraft per user
// - verified = false (HARD)
// - complete = false (HARD)
// - FE NON può impostare id / verified / complete
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../../types/env";

import { OwnerDraftSchema } from "../shcema/owner.draft.schema";
import type { BusinessOwnerDraftInputDTO } from "../DataTransferObject/input/busienss.owner.input.dto.ts";
// ======================================================
// KV
// ======================================================
const OWNER_DRAFT_KEY = (userId: string) =>
  `BUSINESS_OWNER_DRAFT:${userId}`;

// ======================================================
// HANDLER
// ======================================================
export async function createBusinessOwnerDraft(
  request: Request,
  env: Env
): Promise<Response> {

  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const userId = session.user.id;
  const key = OWNER_DRAFT_KEY(userId);
  const now = new Date().toISOString();

  /* =====================
     2️⃣ INPUT
  ====================== */
  const input = (await request.json()) as BusinessOwnerDraftInputDTO;

  /* =====================
     3️⃣ LOAD EXISTING (OPTIONAL)
  ====================== */
  const existingRaw = await env.BUSINESS_KV.get(key);
  const existing = existingRaw
    ? JSON.parse(existingRaw)
    : null;

  /* =====================
     4️⃣ BUILD OWNER DRAFT
  ====================== */
  const ownerDraft = {
    id: existing?.id ?? crypto.randomUUID(),
    userId,

    firstName: input.firstName ?? existing?.firstName,
    lastName: input.lastName ?? existing?.lastName,
    birthDate: input.birthDate ?? existing?.birthDate,
    contact: input.contact ?? existing?.contact,

    source: input.source ?? existing?.source ?? "manual",
    privacy: input.privacy ?? existing?.privacy ,
    verified: false,
   // 🔥 REGOLA DI DOMINIO
   complete: Boolean(
    (input.privacy ?? existing?.privacy)?.accepted === true
  ),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  /* =====================
     5️⃣ VALIDATE
  ====================== */
  const parsed = OwnerDraftSchema.parse(ownerDraft);

  /* =====================
     6️⃣ PERSIST
  ====================== */
  await env.BUSINESS_KV.put(
    key,
    JSON.stringify(parsed),
    {
      metadata: {
        type: "business_owner_draft",
        ownerUserId: userId,
      },
    }
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json({ ok: true }, request, env);
}
