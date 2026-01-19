// ======================================================
// BE || BUSINESS || CREATE DRAFT (FASE 1)
// POST /api/business/create-draft
// ======================================================
//
// RUOLO:
// - Crea un BusinessDraft (scheda amministrativa)
// - Nessun owner
// - Nessuna logica editoriale
//
// INVARIANTI:
// - Auth obbligatoria
// - Zod = source of truth
// - verified SEMPRE false
// - Nessun layout / AI / media
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { CreateBusinessDraftSchema } from "../schema/business.draft.schema";

// =======================
// KV KEYS
// =======================
const BUSINESS_DRAFT_KEY = (draftId: string) =>
  `BUSINESS_DRAFT:${draftId}`;

// =======================
// HANDLER
// =======================
export async function createBusinessDraft(
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
  let input: ReturnType<typeof CreateBusinessDraftSchema.parse>;

  try {
    input = CreateBusinessDraftSchema.parse(
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
     3️⃣ BUILD DRAFT (PURE)
  ====================== */
  const draftId = crypto.randomUUID();

  const draft = {
    id: draftId,

    businessName: input.businessName,
    solutionId: input.solutionId,
    productId: input.productId,

    businessOpeningHour: input.businessOpeningHour ?? {},

    contact: input.contact,

    businessDescriptionTags:
      input.businessDescriptionTags ?? [],
    businessServiceTags:
      input.businessServiceTags ?? [],

    verified: false as const,
  };

  /* =====================
     4️⃣ VALIDATE DRAFT
     (last line of defense)
  ====================== */
  const validatedDraft =
    CreateBusinessDraftSchema.parse(draft);

  /* =====================
     5️⃣ PERSIST (ATOMIC)
  ====================== */
  await env.BUSINESS_KV.put(
    BUSINESS_DRAFT_KEY(draftId),
    JSON.stringify(validatedDraft)
  );

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      draftId,
    },
    request,
    env
  );
}
