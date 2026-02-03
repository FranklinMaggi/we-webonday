// ======================================================
// BE || BUSINESS || REOPEN DRAFT (FASE 1)
// POST /api/business/reopen-draft
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Riapre il flusso guidato BUSINESS + OWNER
// - Il controllo di flusso è demandato ESCLUSIVAMENTE ai draft
//
// MODELLO DATI (POST-FASE-1):
// - BusinessDraft è OWNED dalla Configuration
// - ID BusinessDraft === configurationId
// - OwnerDraft è attualmente globale per user
//
// EFFETTI:
// - BusinessDraft.complete → false
// - OwnerDraft.complete → false
//
// NOTA IMPORTANTE:
// - Configuration.status NON governa il flusso
// - Configuration è usata solo per ownership e routing
// ======================================================

import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import { OwnerDraftSchema } from "@domains/owner/schema/owner.draft.schema";

/* =========================
   INPUT SCHEMA
========================= */
const ReopenBusinessDraftInputSchema = z.object({
  configurationId: z.string().min(1),
});

/* ======================================================
   HANDLER
====================================================== */
export async function reopenBusinessDraft(
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
  let configurationId: string;

  try {
    const body = ReopenBusinessDraftInputSchema.parse(
      await request.json()
    );
    configurationId = body.configurationId;
  } catch {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
     (OWNERSHIP ONLY)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

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

  /* =====================
     4️⃣ REOPEN BUSINESS DRAFT
     (OWNED BY CONFIGURATION)
  ====================== */
  const rawBusiness = await env.BUSINESS_KV.get(
    `BUSINESS_DRAFT:${configurationId}`
  );

  if (!rawBusiness) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const parsedBusiness = BusinessDraftSchema.safeParse(
    JSON.parse(rawBusiness)
  );

  if (!parsedBusiness.success) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_CORRUPTED" },
      request,
      env,
      500
    );
  }

  await env.BUSINESS_KV.put(
    `BUSINESS_DRAFT:${configurationId}`,
    JSON.stringify({
      ...parsedBusiness.data,
      // forza riapertura del flusso guidato
      complete: false,
      updatedAt: new Date().toISOString(),
    })
  );

  /* =====================
     5️⃣ REOPEN OWNER DRAFT
     (GLOBAL PER USER)
  ====================== */
  // NB:
  // OwnerDraft è attualmente globale per user.
  // Se in futuro diventa per-business, la key va versionata.
  const ownerKey = `BUSINESS_OWNER_DRAFT:${session.user.id}`;
  const rawOwner = await env.BUSINESS_KV.get(ownerKey);

  if (rawOwner) {
    const ownerDraft = OwnerDraftSchema.parse(
      JSON.parse(rawOwner)
    );

    await env.BUSINESS_KV.put(
      ownerKey,
      JSON.stringify({
        ...ownerDraft,
        complete: false,
        updatedAt: new Date().toISOString(),
      })
    );
  }

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true },
    request,
    env
  );
}