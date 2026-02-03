// ======================================================
// BE || BUSINESS || OWNER || CREATE DRAFT
// POST /api/owner/create-draft
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { ConfigurationSchema } from "@domains/configuration/schema/configuration.schema";
import { OwnerDraftSchema } from "../schema/owner.draft.schema";
import type { BusinessOwnerDraftInputDTO } from
  "../DataTransferObject/input/busienss.owner.input.dto.ts";
import type { ConfigurationDTO } from "@domains/configuration";


// ======================================================
// BE || OWNER || CREATE DRAFT (CONFIGURATION-OWNED)
// POST /api/owner/create-draft
// ======================================================
//
// AI-SUPERCOMMENT:
// - OwnerDraft è legato a UNA Configuration
// - Supporta N configuration per lo stesso user
// - ID CANONICO = configurationId
// ======================================================

const OWNER_DRAFT_KEY = (configurationId: string) =>
  `OWNER_DRAFT:${configurationId}`;

// ======================================================
// DOMAIN HELPERS
// ======================================================
function isOwnerDraftComplete(draft: {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  address?: { street?: string; city?: string ;province?:string; region?:string; zip?:string; country?:string; };
  contact?: { phoneNumber?: string ,phone?: string};

}) {
  return Boolean(
    draft.firstName &&
    draft.lastName &&
    draft.birthDate &&
    draft.address?.street &&
    draft.address?.city &&
    draft.contact?.phoneNumber
  );
}


export async function createBusinessOwnerDraft(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const input = (await request.json()) as BusinessOwnerDraftInputDTO;
  const { configurationId } = input;

  if (!configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_REQUIRED" },
      request,
      env,
      400
    );
  }

  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as ConfigurationDTO | null;

  if (!configuration || configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  const key = OWNER_DRAFT_KEY(configurationId);
  const existingRaw = await env.BUSINESS_KV.get(key);
  const existing = existingRaw ? JSON.parse(existingRaw) : null;
  const now = new Date().toISOString();

  const ownerDraft = {
    id: configurationId,                 // 🔑 ID CANONICO
    userId: session.user.id,
    configurationId,

    firstName: input.firstName ?? existing?.firstName,
    lastName: input.lastName ?? existing?.lastName,
    birthDate: input.birthDate ?? existing?.birthDate,

    address: { ...existing?.address, ...input.address },
    contact: { ...existing?.contact, ...input.contact },

    source: input.source ?? existing?.source ?? "manual",


    verified: false,
    complete: isOwnerDraftComplete({
      firstName: input.firstName ?? existing?.firstName,
      lastName: input.lastName ?? existing?.lastName,
      birthDate: input.birthDate ?? existing?.birthDate,
      address: { ...existing?.address, ...input.address },
      contact: { ...existing?.contact, ...input.contact }
    }),

    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const parsed = OwnerDraftSchema.parse(ownerDraft);

  await env.BUSINESS_KV.put(key, JSON.stringify(parsed), {
    metadata: {
      type: "owner_draft",
      configurationId,
      userId: session.user.id,
    },
  });

  return json({ ok: true }, request, env);
}