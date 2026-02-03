/**
 * ======================================================
 * AI-SUPERCOMMENT — OWNER VERIFICATION (CONFIGURATION)
 * ======================================================
 *
 * - OwnerDraft è legato a UNA Configuration
 * - Verifica Owner è per-Configuration
 *
 * IDENTITÀ:
 * - OwnerDraft.id === configurationId
 * - Owner.id === configurationId
 *
 * KV:
 * - OWNER_DRAFT:{configurationId}
 * - OWNER_DOCUMENTS:{configurationId}
 * - OWNER:{configurationId}
 *
 * VIETATO:
 * - Lookup per userId
 * - Draft globali
 * ======================================================
 */
// ======================================================
// BE || OWNER || VERIFICATION INIT
// POST /api/owner/verification/init
// ======================================================
//
// RUOLO:
// - Avvia la verifica Owner
// - Crea Owner (pending) SOLO se:
//   - OwnerDraft completo
//   - Documenti owner presenti (front + back)
//
// INVARIANTI:
// - Idempotente
// - Documenti letti da CONFIGURATION
// - Owner creato UNA SOLA VOLTA
//
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { OwnerDraftSchema } from "../schema/owner.draft.schema";
import { OwnerSchema } from "../schema/owner.schema";
import { OwnerDocumentsSchema } from "../schema/owner.document.schema";


// ======================================================
// KV KEYS (CANONICAL)
// ======================================================
const OWNER_KEY = (ownerId: string) => `OWNER:${ownerId}`;
const OWNER_DRAFT_KEY = (configurationId: string) =>
  `OWNER_DRAFT:${configurationId}`;
const OWNER_DOCUMENTS_KEY = (configurationId: string) =>
  `OWNER_DOCUMENTS:${configurationId}`;

// ======================================================
// HANDLER
// ======================================================
export async function initOwnerVerification(
  request: Request,
  env: Env
): Promise<Response> {

  const body = await request.json() as {
    configurationId?: string;
  };
  
  const { configurationId } = body;
  
  if (!configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_REQUIRED" },
      request,
      env,
      400
    );
  }


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

  /* =====================
     2️⃣ LOAD OWNER DRAFT
  ====================== */

  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;
  
  if (!configuration || configuration.userId !== userId) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }
  const rawDraft =
    await env.BUSINESS_KV.get(OWNER_DRAFT_KEY(configurationId));

  if (!rawDraft) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const draft = OwnerDraftSchema.parse(JSON.parse(rawDraft));

  if (!draft.complete) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }

  /* =====================
     3️⃣ LOAD + VALIDATE DOCUMENTS (ZOD)
  ====================== */
  const rawDocs =
    await env.BUSINESS_KV.get(
      OWNER_DOCUMENTS_KEY(draft.configurationId),
      "json"
    );

  const documents = OwnerDocumentsSchema.parse(rawDocs ?? {});

  if (!documents.front || !documents.back) {
    return json(
      { ok: false, error: "OWNER_DOCUMENTS_REQUIRED" },
      request,
      env,
      409
    );
  }

  /* =====================
     4️⃣ CHECK EXISTING OWNER (IDEMPOTENTE)
  ====================== */
  const ownerKey = OWNER_KEY(draft.id);
  const existing = await env.BUSINESS_KV.get(ownerKey);

  if (existing) {
    // owner già creato → idempotenza
    return json({ ok: true }, request, env);
  }

  /* =====================
     5️⃣ CREATE OWNER (PENDING)
  ====================== */
  const now = new Date().toISOString();

  const owner = OwnerSchema.parse({
    id: draft.id,
    userId,
    ownerDraftId: draft.id,

    firstName: draft.firstName,
    lastName: draft.lastName,
    birthDate: draft.birthDate,

    address: draft.address,
    contact: draft.contact,
    source: draft.source,


    // 🔑 DOCUMENTI COPIATI DAL KV
    documents: [
      documents.front,
      documents.back,
    ],

    verified: false,
    createdAt: now,
    updatedAt: now,
  });

  await env.BUSINESS_KV.put(
    ownerKey,
    JSON.stringify(owner),
    {
      metadata: {
        type: "owner_verification_pending",
        ownerId: draft.id,
        configurationId: draft.configurationId,
        userId,
      },
    }
  );

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json({ ok: true }, request, env);
}
