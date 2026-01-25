// ======================================================
// BE || BUSINESS || UPDATE DRAFT (FASE 1)
// POST /api/business/update-draft
// ======================================================
//
// PATCH-LIKE — CANONICAL
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { UpdateBusinessDraftSchema } from "../schema/business.update-draft.schema";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import type { BusinessDraftBaseReadDTO } from "../DataTransferObject/output/business.draft.read.dto";

/* =======================
   KV KEYS
======================= */
const BUSINESS_DRAFT_KEY = (id: string) =>
  `BUSINESS_DRAFT:${id}`;

/* =======================
   COMPLETENESS CHECK
======================= */
function isBusinessDraftComplete(draft: {
  businessName?: string;
  openingHours?: unknown;
  contact?: unknown;
  privacy?: { accepted?: boolean };
}) {
  return Boolean(
    draft.businessName &&
    draft.openingHours &&
    draft.contact &&
    draft.privacy?.accepted === true
  );
}

/* =======================
   HANDLER
======================= */
export async function updateBusinessDraft(
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

  /* =====================
     2️⃣ INPUT (ZOD)
  ====================== */
  let input;
  try {
    input = UpdateBusinessDraftSchema.parse(
      await request.json()
    );
  } catch (err) {
    return json(
      { ok: false, error: "INVALID_INPUT", details: String(err) },
      request,
      env,
      400
    );
  }

  const businessDraftId = input.businessDraftId;
  if (!businessDraftId) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_ID_REQUIRED" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD EXISTING DRAFT
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

  let existing;
  try {
    existing = BusinessDraftSchema.parse(JSON.parse(raw));
  } catch {
    return json(
      { ok: false, error: "CORRUPTED_BUSINESS_DRAFT" },
      request,
      env,
      500
    );
  }

  /* =====================
     4️⃣ MERGE (PATCH-LIKE)
  ====================== */
  const now = new Date().toISOString();

  const merged = {
    ...existing,

    // ---- Editable ----
    businessName:
      input.businessName ?? existing.businessName,

    openingHours:
      input.openingHours ?? existing.openingHours,

    contact:
      input.contact ?? existing.contact,

    businessDescriptionTags:
      input.businessDescriptionTags ??
      existing.businessDescriptionTags,

    businessServiceTags:
      input.businessServiceTags ??
      existing.businessServiceTags,

    // ---- Invariants ----
    solutionId: existing.solutionId,
    productId: existing.productId,
    verified: false,
    privacy: existing.privacy,
    createdAt: existing.createdAt,

    // ---- Meta ----
    updatedAt: now,
  };

  merged.complete = isBusinessDraftComplete(merged);

  /* =====================
     5️⃣ VALIDATE DOMAIN
  ====================== */
  let validated;
  try {
    validated = BusinessDraftSchema.parse(merged);
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
     6️⃣ PERSIST
  ====================== */
  await env.BUSINESS_KV.put(
    BUSINESS_DRAFT_KEY(businessDraftId),
    JSON.stringify(validated)
  );

  /* =====================
     7️⃣ MAP → READ DTO
  ====================== */
  const response: BusinessDraftBaseReadDTO = {
    businessDraftId: validated.id,
    businessName: validated.businessName,
    solutionId: validated.solutionId,
    productId: validated.productId,
    openingHours: validated.openingHours,
    contact: validated.contact,
    businessDescriptionTags: validated.businessDescriptionTags,
    businessServiceTags: validated.businessServiceTags,
    verified: validated.verified,
  };

  return json(
    { ok: true, draft: response },
    request,
    env
  );
}
