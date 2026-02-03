// ======================================================
// BE || BUSINESS || VERIFICATION INIT (FASE 1)
// POST /api/business/verification/init
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Inizializza la fase di VERIFICA del Business
// - Trasforma un BusinessDraft COMPLETO in Business (pending)
//
// MODELLO DI FLUSSO (POST-FASE-1):
// - BusinessDraft.complete === true
// - OwnerDraft.complete === true
// - Nessuna dipendenza da Configuration.status
//
// INVARIANTI:
// - Auth obbligatoria
// - Ownership verificata via Configuration
// - Backend = source of truth
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { BusinessSchema } from "../schema/business.schema";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import { OwnerDraftSchema } from "@domains/owner/schema/owner.draft.schema";

/* =========================
   KV KEYS
========================= */
const CONFIGURATION_KEY = (id: string) => `CONFIGURATION:${id}`;
const BUSINESS_DRAFT_KEY = (id: string) => `BUSINESS_DRAFT:${id}`;
const BUSINESS_KEY = (id: string) => `BUSINESS:${id}`;

/* ======================================================
   HANDLER
====================================================== */
export async function initBusinessVerification(
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

  /* =====================
     2️⃣ INPUT
  ====================== */
  let configurationId: string;

  try {
    const body = (await request.json()) as {
      configurationId?: string;
    };
    configurationId = body.configurationId ?? "";
  } catch {
    return json(
      { ok: false, error: "INVALID_JSON_BODY" },
      request,
      env,
      400
    );
  }

  if (!configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
     (OWNERSHIP ONLY)
  ====================== */
  const configRaw = await env.CONFIGURATION_KV.get(
    CONFIGURATION_KEY(configurationId)
  );

  if (!configRaw) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const configuration = JSON.parse(configRaw);

  if (configuration.userId !== userId) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ LOAD BUSINESS DRAFT
     (OWNED BY CONFIGURATION)
  ====================== */
  const draftRaw = await env.BUSINESS_KV.get(
    BUSINESS_DRAFT_KEY(configurationId)
  );

  if (!draftRaw) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const parsedDraft = BusinessDraftSchema.safeParse(
    JSON.parse(draftRaw)
  );

  if (!parsedDraft.success) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_CORRUPTED" },
      request,
      env,
      500
    );
  }

  const businessDraft = parsedDraft.data;

  if (businessDraft.complete !== true) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }

  /* =====================
     5️⃣ LOAD OWNER DRAFT
     (GLOBAL PER USER)
  ====================== */
  const ownerRaw = await env.BUSINESS_KV.get(
    `BUSINESS_OWNER_DRAFT:${userId}`
  );

  if (!ownerRaw) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const parsedOwner = OwnerDraftSchema.safeParse(
    JSON.parse(ownerRaw)
  );

  if (!parsedOwner.success) {
    return json(
      { ok: false, error: "OWNER_DRAFT_CORRUPTED" },
      request,
      env,
      500
    );
  }

  const ownerDraft = parsedOwner.data;

  if (ownerDraft.complete !== true) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }

  /* =====================
     6️⃣ IDEMPOTENCY CHECK
  ====================== */
  const existing = await env.BUSINESS_KV.get(
    BUSINESS_KEY(configurationId)
  );

  if (existing) {
    return json(
      { ok: true, status: "ALREADY_INITIALIZED" },
      request,
      env
    );
  }

  /* =====================
     7️⃣ CREATE BUSINESS (PENDING)
  ====================== */
  const now = new Date().toISOString();

  const business = BusinessSchema.parse({
    ...businessDraft,

    id: configurationId,
    publicId:
      businessDraft.id ??
      configurationId,

    ownerUserId: userId,
    createdByUserId: userId,
    editorUserIds: [],

    logo: null,
    coverImage: null,
    gallery: [],
    documents: [],

    status: "pending",

    createdAt: now,
    updatedAt: now,
  });

  await env.BUSINESS_KV.put(
    BUSINESS_KEY(business.id),
    JSON.stringify(business)
  );

  /* =====================
     8️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessId: business.id,
      status: business.status,
    },
    request,
    env
  );
}