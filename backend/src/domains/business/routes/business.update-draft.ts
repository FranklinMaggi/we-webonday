// ======================================================
// BE || BUSINESS || UPDATE DRAFT (FASE 1)
// POST /api/business/update-draft
// ======================================================
//
// AI-SUPERCOMMENT — BUSINESS DRAFT UPDATE (PATCH-LIKE)
//
// RUOLO:
// - Aggiorna un BusinessDraft esistente
// - Usato dal configurator (Step Business)
//
// SUPPORTA:
// - lookup via businessDraftId
// - lookup via configurationId
//
// INVARIANTI:
// - Auth obbligatoria
// - verified NON modificabile
// - solutionId / productId NON modificabili
// - Nessuna creazione implicita
// - Backend = source of truth
//
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { UpdateBusinessDraftSchema } from "../schema/business.update-draft.schema";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import type { BusinessDraftBaseReadDTO } from "../DataTransferObject/output/business.draft.read.dto";

// =======================
// KV KEYS
// =======================
const BUSINESS_DRAFT_KEY = (id: string) =>
  `BUSINESS_DRAFT:${id}`;

const DRAFT_BY_CONFIG_KEY = (configurationId: string) =>
  `BUSINESS_DRAFT_BY_CONFIGURATION:${configurationId}`;

// =======================
// HANDLER
// =======================
export async function updateBusinessDraft(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH (HARD GUARD)
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
     2️⃣ PARSE INPUT (ZOD)
  ====================== */
  let input;
  try {
    input = UpdateBusinessDraftSchema.parse(
      await request.json()
    );
  } catch (err) {
    return json(
      {
        ok: false,
        error: "INVALID_INPUT",
        details: String(err),
      },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ RESOLVE DRAFT ID
  ====================== */
  let businessDraftId: string | null = null;

  if (input.businessDraftId) {
    businessDraftId = input.businessDraftId;
  } else if (input.configurationId) {
    businessDraftId = await env.BUSINESS_KV.get(
      DRAFT_BY_CONFIG_KEY(input.configurationId)
    );
  }

  if (!businessDraftId) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     4️⃣ LOAD EXISTING DRAFT
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    BUSINESS_DRAFT_KEY(businessDraftId)
  );

  if (!raw) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  let existingDraft;
  try {
    existingDraft = BusinessDraftSchema.parse(
      JSON.parse(raw)
    );
  } catch {
    return json(
      { ok: false, error: "CORRUPTED_BUSINESS_DRAFT" },
      request,
      env,
      500
    );
  }

  /* =====================
     5️⃣ MERGE (PATCH-LIKE)
  ====================== */
  const now = new Date().toISOString();

  const mergedDraft = {
    ...existingDraft,

    // ---- Editable fields only ----
    businessName:
      input.businessName ?? existingDraft.businessName,

    businessOpeningHour:
      input.businessOpeningHour ??
      existingDraft.businessOpeningHour,

    contact:
      input.contact ?? existingDraft.contact,

    businessDescriptionTags:
      input.businessDescriptionTags ??
      existingDraft.businessDescriptionTags,

    businessServiceTags:
      input.businessServiceTags ??
      existingDraft.businessServiceTags,
    privacy:existingDraft.privacy,
    // ---- Meta ----
    updatedAt: now,
  };

  /* =====================
     6️⃣ VALIDATE DOMAIN
  ====================== */
  let validatedDraft;
  try {
    validatedDraft = BusinessDraftSchema.parse(
      mergedDraft
    );
  } catch (err) {
    return json(
      {
        ok: false,
        error: "BUSINESS_DRAFT_VALIDATION_FAILED",
        details: String(err),
      },
      request,
      env,
      400
    );
  }

  /* =====================
     7️⃣ PERSIST (ATOMIC)
  ====================== */
  await env.BUSINESS_KV.put(
    BUSINESS_DRAFT_KEY(businessDraftId),
    JSON.stringify(validatedDraft)
  );

  /* =====================
     8️⃣ MAP → READ DTO
  ====================== */
  const response: BusinessDraftBaseReadDTO = {
    businessDraftId: validatedDraft.id,
    businessName: validatedDraft.businessName,
    solutionId: validatedDraft.solutionId,
    productId: validatedDraft.productId,
    businessOpeningHour:
      validatedDraft.businessOpeningHour,
      contact: {
        mail: validatedDraft.contact.mail,
        phoneNumber: validatedDraft.contact.phoneNumber,
        pec: validatedDraft.contact.pec,
        address: validatedDraft.contact.address,
      },
    businessDescriptionTags:
      validatedDraft.businessDescriptionTags,
    businessServiceTags:
      validatedDraft.businessServiceTags,
    verified: false,
  };

  /* =====================
     9️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      draft: response,
    },
    request,
    env
  );
}
