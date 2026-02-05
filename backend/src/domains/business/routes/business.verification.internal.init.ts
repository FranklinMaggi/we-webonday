import type { Env } from "../../../types/env";


import { BusinessSchema } from "../schema/business.schema";
import { OwnerSchema } from "@domains/owner/schema/owner.schema";
import {BUSINESS_KEY,} from "../keys";

import { OWNER_KEY } from "@domains/owner/keys";

export type BusinessVerificationResult =
  | "CREATED"
  | "SKIPPED";

export async function initBusinessVerificationInternal(
  env: Env,
  configurationId: string,
  userId: string
): Promise<BusinessVerificationResult> {

  /* =====================
     LOAD BUSINESS DRAFT
  ====================== */
  const rawBusinessDraft = await env.BUSINESS_KV.get(
    BUSINESS_KEY(configurationId)
  );
  if (!rawBusinessDraft) {
    throw new Error("BUSINESS_DRAFT_NOT_FOUND");
  }

  const businessDraft = BusinessSchema.parse(
    JSON.parse(rawBusinessDraft)
  );

  if (businessDraft.businessDataComplete !== true) {
    return "SKIPPED";
  }

  /* =====================
     LOAD OWNER DRAFT
  ====================== */
  const rawOwnerDraft = await env.BUSINESS_KV.get(
    OWNER_KEY(userId));

  if (!rawOwnerDraft) {
    throw new Error("OWNER_DRAFT_NOT_FOUND");
  }

  const ownerDraft = OwnerSchema.parse(
    JSON.parse(rawOwnerDraft)
  );

  /* =====================
     IDEMPOTENCY
  ====================== */
  const businessKey = BUSINESS_KEY(configurationId);
  if (await env.BUSINESS_KV.get(businessKey)) {
    return "SKIPPED";
  }

  /* =====================
     CREATE BUSINESS (PENDING)
  ====================== */
  const now = new Date().toISOString();

  const business = BusinessSchema.parse({
    ...businessDraft,

    id: configurationId,
    publicId: configurationId,

    ownerUserId: userId,
    createdByUserId: userId,
    editorUserIds: [],

    logo: null,
    coverImage: null,
    gallery: [],
    documents: [],

    verification: "PENDING", // 🔒 CANONICO

    createdAt: now,
    updatedAt: now,
  });

  await env.BUSINESS_KV.put(
    businessKey,
    JSON.stringify(business)
  );

  return "CREATED";
}