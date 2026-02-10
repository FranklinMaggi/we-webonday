// ======================================================
// BE || BUSINESS || CREATE / UPDATE DRAFT (FASE 1)
// POST /api/business/create-draft
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Crea o aggiorna il BusinessDraft
// - Il BusinessDraft è OWNED dalla Configuration
//
// INVARIANTI ARCHITETTURALI (NON NEGOZIABILI):
// - ID del BusinessDraft === configurationId
// - Nessun businessDraftId separato
// - KV key: BUSINESS_DRAFT:{configurationId}
// - Backend = source of truth
// ======================================================

import { BUSINESS_KEY } from "../keys";
import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import type { ConfigurationDTO } from "@domains/configuration/schema/configuration.schema";
import { BusinessSchema } from "../schema/business.schema";
import { BusinessUpsertInputSchema } from "../DataTransferObject/input/business.draft.input.dto";
import {
  OpeningHoursDTO,
  isOpeningHoursEmpty,
  EMPTY_OPENING_HOURS,
} from "@domains/GeneralSchema/hours.opening.schema";
import { generateBusinessDescription } from "@domains/business/lib/geminiAI/gemini.business";

/* ======================================================
   COMPLETENESS CHECK — DOMAIN ONLY
====================================================== */
function isBusinessDataComplete(draft: {
  businessName?: string;
  openingHours?: OpeningHoursDTO;
  contact?: { mail?: string };
  address?: {
    street?: string;
    number?: string;
    city?: string;
  };
}) {
  return Boolean(
    draft.businessName &&
      draft.openingHours &&
      !isOpeningHoursEmpty(draft.openingHours) &&
      draft.contact?.mail &&
      draft.address?.street &&
      draft.address?.number &&
      draft.address?.city
  );
}

/* ======================================================
   HANDLER
====================================================== */
export async function upsertBusiness(
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
     2️⃣ INPUT VALIDATION
  ====================== */
  let input: z.infer<typeof BusinessUpsertInputSchema>;
  try {
    input = BusinessUpsertInputSchema.parse(await request.json());
  } catch (err) {
    return json(
      { ok: false, error: "INVALID_INPUT", details: String(err) },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
  ====================== */
  const configuration = (await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${input.configurationId}`,
    "json"
  )) as ConfigurationDTO | null;

  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  if (configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  /* =====================
     4️⃣ CANONICAL ID
  ====================== */
  const configurationId = configuration.id;
  const now = new Date().toISOString();

  /* =====================
     5️⃣ LOAD EXISTING DRAFT
  ====================== */
  const existingRaw = await env.BUSINESS_KV.get(
    BUSINESS_KEY(configurationId)
  );

  /* =====================================================
     CREATE — FIRST WRITE
  ===================================================== */
  if (!existingRaw) {
    const businessDataComplete = isBusinessDataComplete({
      businessName: input.businessName,
      openingHours: input.openingHours,
      contact: input.contact,
      address: input.address,
    });
    let businessDescriptionText: string | undefined;

    if (
      input.businessDescriptionTags?.length ||
      input.businessServiceTags?.length
    ) {
      try {
        businessDescriptionText = await generateBusinessDescription(env, {
          name: input.businessName ?? "Attività",
          sector: configuration.solutionId.replace(/-/g, " "),
          businessDescriptionTags: input.businessDescriptionTags ?? [],
          businessServiceTags: input.businessServiceTags ?? [],
        });
      } catch {}
    }
    const candidate = {
      id: configurationId,
      configurationId,

      ownerUserId: session.user.id,
      createdByUserId: session.user.id,
      editorUserIds: [],

      publicId: configurationId,

      solutionId: configuration.solutionId,
      productId: configuration.productId,

      businessName: input.businessName ?? "Attività",
      openingHours: input.openingHours ?? EMPTY_OPENING_HOURS,
      contact: input.contact ?? {},
      address: input.address ?? {},

      businessDescriptionTags: input.businessDescriptionTags ?? [],
      businessServiceTags: input.businessServiceTags ?? [],
      businessDescriptionText: businessDescriptionText,

      logo: null,
      coverImage: null,
      gallery: [],
      documents: [],

      verification: "DRAFT",
      businessDataComplete,

      createdAt: now,
      updatedAt: now,
    };

    const draft = BusinessSchema.parse(candidate);

    await env.BUSINESS_KV.put(
      BUSINESS_KEY(configurationId),
      JSON.stringify(draft)
    );

    return json(
      {
        ok: true,
        configurationId,
        businessDraftId: configurationId,
        reused: false,
      },
      request,
      env
    );
  }

  /* =====================================================
     UPDATE — MERGE + AI + VALIDATE
  ===================================================== */
  const existing = BusinessSchema.parse(JSON.parse(existingRaw));

  const descriptionTagsChanged =
    JSON.stringify(existing.businessDescriptionTags) !==
    JSON.stringify(
      input.businessDescriptionTags ?? existing.businessDescriptionTags
    );

  const serviceTagsChanged =
    JSON.stringify(existing.businessServiceTags) !==
    JSON.stringify(
      input.businessServiceTags ?? existing.businessServiceTags
    );

  const shouldRegenerateDescription =
    descriptionTagsChanged || serviceTagsChanged;
    console.log(
      "[BOOT ENV]",
      "GEMINI_API_KEY" in env,
      env.GEMINI_API_KEY?.slice(0, 6)
    );
  let businessDescriptionText = existing.businessDescriptionText;
  console.log("[GEMINI KEY PRESENT]", Boolean(env.GEMINI_API_KEY));
  console.log("[OPENAI CHECK]", {
    descriptionTagsChanged,
    serviceTagsChanged,
    shouldRegenerateDescription,
    existing: {
      desc: existing.businessDescriptionTags,
      serv: existing.businessServiceTags,
    },
    input: {
      desc: input.businessDescriptionTags,
      serv: input.businessServiceTags,
    },
  });
  if (shouldRegenerateDescription) {
    try {
      businessDescriptionText = await generateBusinessDescription(env, {
        name: input.businessName ?? existing.businessName,
        sector: existing.solutionId.replace(/-/g, " "),
        businessDescriptionTags:
          input.businessDescriptionTags ??
          existing.businessDescriptionTags,
        businessServiceTags:
          input.businessServiceTags ??
          existing.businessServiceTags,
      });if (
        businessDescriptionText &&
        businessDescriptionText.length < 40
      ) {
        console.warn(
          "[AI] Generated description too short, discarded",
          businessDescriptionText
        );
        businessDescriptionText = undefined;
      }
      
    } catch (err) {
      console.error(
        "[OPENAI] Failed to generate business description",
        err
      );
      // fallback: mantieni il testo precedente
    }
  }

  const merged = {
    ...existing,

    businessName: input.businessName ?? existing.businessName,
    openingHours: input.openingHours ?? existing.openingHours,
    contact: input.contact ?? existing.contact,
    address: input.address ?? existing.address,

    businessDescriptionTags:
      input.businessDescriptionTags ??
      existing.businessDescriptionTags,

    businessServiceTags:
      input.businessServiceTags ??
      existing.businessServiceTags,

    businessDescriptionText,

    // invarianti
    solutionId: existing.solutionId,
    productId: existing.productId,
    createdAt: existing.createdAt,
    updatedAt: now,
  };

  merged.businessDataComplete = isBusinessDataComplete(merged);

  const validated = BusinessSchema.parse(merged);

  await env.BUSINESS_KV.put(
    BUSINESS_KEY(configurationId),
    JSON.stringify(validated)
  );

  return json(
    {
      ok: true,
      configurationId,
      businessDraftId: configurationId,
      reused: true,
    },
    request,
    env
  );
}
