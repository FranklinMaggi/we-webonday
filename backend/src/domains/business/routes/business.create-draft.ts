// ======================================================
// BE || BUSINESS || CREATE / UPDATE DRAFT (FASE 1)
// POST /api/business/create-draft
// ======================================================

import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import type { ConfigurationDTO } from "@domains/configuration";
import { CreateBusinessDraftSchema } from "../schema/business.create-draft.schema";
import { BusinessDraftSchema } from "../schema/business.draft.schema";

/* ======================================================
   KV KEYS — CANONICAL
====================================================== */
const BUSINESS_DRAFT_KEY = (id: string) =>
  `BUSINESS_DRAFT:${id}`;

/* ======================================================
   COMPLETENESS CHECK — DOMAIN ONLY
====================================================== */
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

/* ======================================================
   HANDLER
====================================================== */
export async function createBusinessDraft(
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
     2️⃣ INPUT VALIDATION (ZOD = SOURCE OF TRUTH)
  ====================== */
  let input: z.infer<typeof CreateBusinessDraftSchema>;
  try {
    input = CreateBusinessDraftSchema.parse(
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

  /* =====================
     3️⃣ LOAD CONFIGURATION (SOURCE OF TRUTH)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${input.configurationId}`,
    "json"
  ) as ConfigurationDTO | null;

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

  if (!configuration.businessDraftId) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_ID_MISSING" },
      request,
      env,
      409
    );
  }

  if (
    configuration.solutionId !== input.solutionId ||
    configuration.productId !== input.productId
  ) {
    return json(
      { ok: false, error: "COMMERCIAL_MISMATCH" },
      request,
      env,
      409
    );
  }

  const businessDraftId = configuration.businessDraftId;
  const now = new Date().toISOString();

  /* =====================
     4️⃣ DOMAIN DATA (ALREADY VALIDATED)
  ====================== */
  const openingHours = input.openingHours;

  /* =====================
     5️⃣ LOAD EXISTING DRAFT (IF ANY)
  ====================== */
  const existingRaw = await env.BUSINESS_KV.get(
    BUSINESS_DRAFT_KEY(businessDraftId)
  );

  /* =====================================================
     CREATE — FIRST WRITE
  ===================================================== */
  if (!existingRaw) {
    const complete = isBusinessDraftComplete({
      businessName: input.businessName,
      openingHours,
      contact: input.contact,
      privacy: input.privacy,
    });

    const candidate = {
      id: businessDraftId,
      configurationId: input.configurationId,
      userId: session.user.id,

      businessName: input.businessName,
      solutionId: input.solutionId,
      productId: input.productId,

      // ✅ dominio canonico
      openingHours,

      contact: input.contact,

      businessDescriptionTags: input.businessDescriptionTags ?? [],
      businessServiceTags: input.businessServiceTags ?? [],

      privacy: input.privacy,

      complete,
      verified: false as const,

      createdAt: now,
      updatedAt: now,
    };

    const draft = BusinessDraftSchema.parse(candidate);

    await env.BUSINESS_KV.put(
      BUSINESS_DRAFT_KEY(businessDraftId),
      JSON.stringify(draft)
    );

    return json(
      { ok: true, businessDraftId, reused: false },
      request,
      env
    );
  }

  /* =====================================================
     UPDATE — MERGE + VALIDATE
  ===================================================== */
  const existing = BusinessDraftSchema.parse(
    JSON.parse(existingRaw)
  );

  const merged = {
    ...existing,

    businessName: input.businessName ?? existing.businessName,

    openingHours: input.openingHours ?? existing.openingHours,

    contact: input.contact ?? existing.contact,

    businessDescriptionTags:
      input.businessDescriptionTags ??
      existing.businessDescriptionTags,

    businessServiceTags:
      input.businessServiceTags ??
      existing.businessServiceTags,

    privacy: input.privacy ?? existing.privacy,

    solutionId: existing.solutionId,
    productId: existing.productId,

    verified: false as const,
    createdAt: existing.createdAt,
    updatedAt: now,
  };

  merged.complete = isBusinessDraftComplete({
    businessName: merged.businessName,
    openingHours: merged.openingHours,
    contact: merged.contact,
    privacy: merged.privacy,
  });

  const validated = BusinessDraftSchema.parse(merged);

  await env.BUSINESS_KV.put(
    BUSINESS_DRAFT_KEY(businessDraftId),
    JSON.stringify(validated)
  );

  return json(
    { ok: true, businessDraftId, reused: true },
    request,
    env
  );
}
