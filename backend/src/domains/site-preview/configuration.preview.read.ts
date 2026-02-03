// ======================================================
// BE || CONFIGURATION || PREVIEW READ
// GET /api/configuration/:id/preview
// ======================================================
//
// RUOLO:
// - Restituisce i dati per Site Preview
// - Astratto da Business / BusinessDraft
//
// INVARIANTI:
// - Auth obbligatoria
// - Ownership check
// - 1 sola response shape
// ======================================================

import type { Env } from "../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

import { getConfiguration } from "@domains/configuration/keys.ts";
import { mapBusinessPreview } from "@domains/business/mappers/business.preview.mapper";


export async function readConfigurationPreview(
  request: Request,
  env: Env,
  id: string
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  /* =====================
     2️⃣ LOAD CONFIGURATION
  ====================== */
  const configuration = await getConfiguration(env, id);
  if (!configuration) {
    return json({ ok: false, error: "CONFIGURATION_NOT_FOUND" }, request, env, 404);
  }

  if (configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  /* =====================
     3️⃣ RESOLVE SOURCE
  ====================== */


    if (!rawBusiness) {
      return json({ ok: false, error: "BUSINESS_NOT_FOUND" }, request, env, 404);
    }

    const business = rawBusiness as any;

    return json(
      {
        ok: true,
        preview: mapBusinessPreview(business),
      },
      request,
      env
    );
  }



    if (!rawDraft) {
      return json({ ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" }, request, env, 404);
    }

    const draft = rawDraft as any;

    return json(
      {
        ok: true,
        preview: mapBusinessPreview(draft
        ),
      },
      request,
      env
    );
  }

  /* =====================
     4️⃣ EMPTY PREVIEW (BOOTSTRAP)
  ====================== */
  return json(
    {
      ok: true,
      preview: {
        id: id,
        isDraft: true,
        businessName: configuration.prefill?.businessName ?? "Attività",
        contact: {},
        openingHours: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
        businessDescriptionTags: [],
        businessServiceTags: [],
      },
    },
    request,
    env
  );
}