// ======================================================
// BE || BUSINESS || REOPEN (RESET TO DRAFT)
// POST /api/business/reopen-draft
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Riporta il Business allo stato di DRAFT
// - Riavvia il flusso guidato BUSINESS + OWNER
//
// INVARIANTI CANONICI:
// - Business è OWNED dalla Configuration
// - Business ID === configurationId
// - KV key: BUSINESS:{configurationId}
// - Draft = STATO, non entità
//
// EFFETTI:
// - businessDataComplete → false
// - verification → PENDING
// - ownerDataComplete → false
//
// NOTE:
// - Configuration NON governa il flusso
// - Configuration serve solo per ownership e routing
// ======================================================

import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { BusinessSchema } from "../schema/business.schema";
import { BUSINESS_KEY } from "../keys";

import { OwnerSchema } from "@domains/owner/schema/owner.schema";
import { OWNER_KEY } from "@domains/owner/keys";

/* =========================
   INPUT SCHEMA
========================= */
const ReopenBusinessInputSchema = z.object({
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
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  /* =====================
     2️⃣ INPUT
  ====================== */
  let configurationId: string;

  try {
    ({ configurationId } = ReopenBusinessInputSchema.parse(
      await request.json()
    ));
  } catch {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
     (OWNERSHIP ONLY)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as { userId?: string } | null;

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
     4️⃣ REOPEN BUSINESS
     (RESET STATE)
  ====================== */
  const rawBusiness = await env.BUSINESS_KV.get(
    BUSINESS_KEY(configurationId)
  );

  if (!rawBusiness) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const parsedBusiness = BusinessSchema.safeParse(
    JSON.parse(rawBusiness)
  );

  if (!parsedBusiness.success) {
    return json(
      { ok: false, error: "BUSINESS_CORRUPTED" },
      request,
      env,
      500
    );
  }

  await env.BUSINESS_KV.put(
    BUSINESS_KEY(configurationId),
    JSON.stringify({
      ...parsedBusiness.data,
      verification: "DRAFT",
      businessDataComplete: false,
      updatedAt: new Date().toISOString(),
    })
  );

  /* =====================
     5️⃣ REOPEN OWNER
     (USER-SCOPED)
  ====================== */
  const ownerKey = OWNER_KEY(session.user.id);
  const rawOwner = await env.BUSINESS_KV.get(ownerKey);

  if (rawOwner) {
    const owner = OwnerSchema.parse(JSON.parse(rawOwner));

    await env.BUSINESS_KV.put(
      ownerKey,
      JSON.stringify({
        ...owner,
        verification: "DRAFT",
     
        updatedAt: new Date().toISOString(),
      })
    );
  }

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json({ ok: true }, request, env);
}
