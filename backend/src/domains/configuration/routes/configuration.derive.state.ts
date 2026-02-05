// ======================================================
// BE || CONFIGURATION || ATTACH OWNER (DERIVATION POINT)
// ======================================================
//
// RUOLO:
// - Deriva complete da Draft
// - Crea slot OWNER e BUSINESS
// - NON avvia verifiche
//
// ======================================================
import { z } from "zod"; 
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "types/env";

import { CONFIGURATION_KEY } from "@domains/configuration/keys";
import { OWNER_KEY } from "@domains/owner/keys";
import { BUSINESS_KEY } from "@domains/business/keys";
import { ConfigurationDTO } from "../schema/configuration.schema";
import { OwnerSchema } from "@domains/owner/schema/owner.schema";
import { BusinessSchema } from "@domains/business/schema/business.schema";

const AttachOwnerInputSchema = z.object({
  configurationId: z.string().min(1),
});

type AttachOwnerInputDTO = z.infer<typeof AttachOwnerInputSchema>;

export async function configurationDeriveState(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  let input: { configurationId: string };
  try {
    input = AttachOwnerInputSchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_BODY" }, request, env, 400);
  }

  const { configurationId } = input;

  const configuration = await env.CONFIGURATION_KV.get(
    CONFIGURATION_KEY(configurationId),
    "json"
  ) as ConfigurationDTO | null;
  
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
     LOAD ENTITIES (READ)
  ====================== */

  const rawOwner = await env.BUSINESS_KV.get(
    OWNER_KEY(session.user.id)
  );

  const rawBusiness = await env.BUSINESS_KV.get(
    BUSINESS_KEY(configurationId)
  );

  if (!rawOwner || !rawBusiness) {
    return json(
      {
        ok: true,
        ownerReady: false,
        businessReady: false,
        readyForSubmit: false,
      },
      request,
      env
    );
  }

  const owner = OwnerSchema.parse(JSON.parse(rawOwner));
  const business = BusinessSchema.parse(JSON.parse(rawBusiness));

  const ownerReady =
  owner.verification !== "REJECTED";


  const businessReady =
    business.verification === "DRAFT";
    if (ownerReady && businessReady) {
      /* =====================
         PROMOTE STATES
      ====================== */
    //Se Owner è PENDING o ACCEPTED → non viene toccato
      // 1️⃣ Promote OWNER → PENDING
      if (owner.verification === "DRAFT") {
        await env.BUSINESS_KV.put(
          OWNER_KEY(session.user.id),
          JSON.stringify({
            ...owner,
            verification: "PENDING",
            updatedAt: new Date().toISOString(),
          })
        );
      }
      // 2️⃣ Promote BUSINESS → PENDING
      if (business.verification === "DRAFT") {
        await env.BUSINESS_KV.put(
          BUSINESS_KEY(configurationId),
          JSON.stringify({
            ...business,
            verification: "PENDING",
            updatedAt: new Date().toISOString(),
          })
        );
      }
      // 3️⃣ Promote CONFIGURATION → BUSINESS_READY
      if (
        ownerReady &&
       businessReady &&
        configuration.status !== "BUSINESS_READY"
      ) {
        await env.CONFIGURATION_KV.put(
          CONFIGURATION_KEY(configurationId),
          JSON.stringify({
            ...configuration,
            status: "BUSINESS_READY",
            updatedAt: new Date().toISOString(),
          })
        );
      }
    }
  return json(
    {
      ok: true,
      ownerVerification: owner.verification,
      businessVerification: business.verification,
      configurationStatus: configuration.status
    },
    request,
    env
  );
}
