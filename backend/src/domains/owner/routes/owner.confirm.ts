// ======================================================
// BE || BUSINESS || OWNER || CONFIRM (DRAFT)
// POST /api/business/owner/confirm
// ======================================================
//
// RUOLO:
// - Congela l'OwnerDraft associato a un BusinessDraft
// - Step OBBLIGATORIO prima della creazione del Business
//
// INVARIANTI:
// - Auth HARD obbligatoria
// - Ownership basata su BusinessDraft
// - verified → true
// - FE NON può forzare dati
// ======================================================

import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { assertConfigurationOwnershipByBusinessDraft } from "@domains/business/lib/assertConfigurationOwnershipByBusinessDraft";
import { OwnerDraftSchema } from "../schema/owner.draft.schema";

// ======================================================
// BE || OWNER || CONFIRM DRAFT (CONFIGURATION-OWNED)
// POST /api/owner/confirm
// ======================================================
//
// AI-SUPERCOMMENT:
// - Conferma OwnerDraft di UNA Configuration
// - NON dipende dal BusinessDraft
// ======================================================

const OWNER_DRAFT_KEY = (configurationId: string) =>
  `OWNER_DRAFT:${configurationId}`;

const ConfirmOwnerInputSchema = z.object({
  configurationId: z.string().uuid(),
});

export async function confirmBusinessOwner(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const { configurationId } = ConfirmOwnerInputSchema.parse(
    await request.json()
  );

  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

  if (!configuration || configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  const raw = await env.BUSINESS_KV.get(
    OWNER_DRAFT_KEY(configurationId)
  );

  if (!raw) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const draft = OwnerDraftSchema.parse(JSON.parse(raw));

  const confirmed = OwnerDraftSchema.parse({
    ...draft,
    verified: true,
    updatedAt: new Date().toISOString(),
  });

  await env.BUSINESS_KV.put(
    OWNER_DRAFT_KEY(configurationId),
    JSON.stringify(confirmed)
  );

  return json(
    { ok: true, configurationId },
    request,
    env
  );
}