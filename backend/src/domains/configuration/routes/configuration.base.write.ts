import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

import { ConfigurationBaseInputSchema } from "../schema/configuration.draft.schema";
import type { ConfigurationDTO } from "../schema/configuration.schema";

import {
  CONFIGURATION_KEY,
  USER_CONFIGURATIONS_KEY,
} from "../keys";

export async function createConfigurationBase(
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
  let body;
  try {
    body = ConfigurationBaseInputSchema.parse(
      await request.json()
    );
  } catch {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ BUILD ID
     (NON deterministico, workspace isolato)
  ====================== */
  const configurationId = crypto.randomUUID();
  const now = new Date().toISOString();

  /* =====================
     4️⃣ BUILD CONFIGURATION (BASE)
  ====================== */
  const configuration: ConfigurationDTO = {
    prefill: {
      businessName: body.businessName,
    },

    id: configurationId,
    userId: session.user.id,
    dataComplete:false, 
    solutionId: body.solutionId,
    productId: body.productId,

    options: [],
    data: {},
    status: "DRAFT",

    createdAt: now,
    updatedAt: now,
  };

  /* =====================
     5️⃣ PERSIST CONFIGURATION
  ====================== */
  await env.CONFIGURATION_KV.put(
    CONFIGURATION_KEY(configurationId),
    JSON.stringify(configuration)
  );

  /* =====================
     6️⃣ INDEX USER → CONFIGURATIONS
  ====================== */
  const listKey = USER_CONFIGURATIONS_KEY(
    session.user.id
  );

  const list: string[] =
    (await env.CONFIGURATION_KV.get(
      listKey,
      "json"
    )) ?? [];

  if (!list.includes(configurationId)) {
    await env.CONFIGURATION_KV.put(
      listKey,
      JSON.stringify([...list, configurationId])
    );
  }

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, configurationId },
    request,
    env,
    201
  );
}