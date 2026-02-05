import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { OWNER_KEY } from "@domains/owner/keys";
import { OwnerSchema } from "@domains/owner/schema/owner.schema";

import { BusinessSchema } from "../schema/business.schema";
import { mapBusinessPreview } from "../mappers/business.preview.mapper";
import { BUSINESS_KEY } from "../keys";

export async function getBusinessPreview(
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
  const configurationId = new URL(request.url)
    .searchParams.get("configurationId");

  if (!configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ OWNERSHIP (CONFIGURATION)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as { userId?: string } | null;

  if (!configuration || configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ LOAD BUSINESS (STATE-BASED)
  ====================== */
  const rawBusiness = await env.BUSINESS_KV.get(
    BUSINESS_KEY(configurationId)
  );

  // Business non ancora creato → preview vuota (draft iniziale)
  if (!rawBusiness) {
    return json(
      {
        ok: true,
        preview: {
          configurationId,
          businessDataComplete: false,
        },
      },
      request,
      env
    );
  }

  /* =====================
     5️⃣ VALIDATE (FASE 1)
  ====================== */
  const business = BusinessSchema.parse(
    JSON.parse(rawBusiness)
  );

  /* =====================
     6️⃣ LOAD OWNER (USER-SCOPED)
  ====================== */
  const rawOwner = await env.BUSINESS_KV.get(
    OWNER_KEY(session.user.id),
    "json"
  );

  const owner = rawOwner
    ? OwnerSchema.parse(rawOwner)
    : undefined;

  /* =====================
     7️⃣ MAP PREVIEW
  ====================== */
  const preview = mapBusinessPreview(business, owner);

  return json(
    { ok: true, preview },
    request,
    env
  );
}
