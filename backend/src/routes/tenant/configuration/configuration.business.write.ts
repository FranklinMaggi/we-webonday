// ======================================================
// BE || POST /api/configuration/from-business
// ======================================================
//
// CREA O AGGIORNA CONFIGURATION PARZIALE
// (dopo StepBusiness)
//
// ======================================================

import { z } from "zod";
import type { Env } from "../../../types/env";
import { requireUser } from "../../../lib/auth/session";
import { json } from "../../../lib/https";

import {configurationKey,userConfigurationsKey,buildConfigurationId,} from "./configuration/configuration.schema";
import { BusinessSchema } from "../../../domains/business/business.schema";
import { ProductSchema } from "../../../domains/product/product.schema";
import type { ConfigurationDTO } from "./configuration/configuration.schema";

// =========================
// INPUT
// =========================
const InputSchema = z.object({
  businessId: z.string().min(1),
  productId: z.string().min(1),
  optionIds: z.array(z.string()).default([]),
});

export async function upsertConfigurationFromBusiness(
  request: Request,
  env: Env
) {
  // =========================
  // AUTH
  // =========================
  const session = await requireUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  // =========================
  // INPUT
  // =========================
  const body = InputSchema.parse(await request.json());

  // =========================
  // LOAD BUSINESS
  // =========================
  const rawBusiness = await env.BUSINESS_KV.get(
    `BUSINESS:${body.businessId}`
  );
  if (!rawBusiness) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const business = BusinessSchema.parse(JSON.parse(rawBusiness));

  // =========================
  // LOAD PRODUCT
  // =========================
  const rawProduct = await env.PRODUCTS_KV.get(
    `PRODUCT:${body.productId}`
  );
  if (!rawProduct) {
    return json(
      { ok: false, error: "PRODUCT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const product = ProductSchema.parse(JSON.parse(rawProduct));

  // =========================
  // BUILD CONFIGURATION ID
  // =========================
  const configurationId = buildConfigurationId(
    business.name,
    business.solutionId
  );
  

  const key = configurationKey(configurationId);

  // =========================
  // UPSERT CONFIGURATION
  // =========================

  const existing =
  (await env.CONFIGURATION_KV.get(key, "json")) as ConfigurationDTO | null;

  const now = new Date().toISOString();

  const configuration = {
    ...(existing ?? {}),
    id: configurationId,
    userId: session.user.id,
    solutionId : business.solutionId,
   
    productId: product.id,
    options: body.optionIds,
    
    data: existing?.data ?? {
        businessId: business.id,
      },

    status: "BUSINESS_READY",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await env.CONFIGURATION_KV.put(
    key,
    JSON.stringify(configuration)
  );

  // =========================
  // INDEX USER → CONFIGURATIONS
  // =========================
  const listKey = userConfigurationsKey(session.user.id);
  const list: string[] =
    (await env.CONFIGURATION_KV.get(listKey, "json")) ?? [];

  if (!list.includes(configurationId)) {
    list.push(configurationId);
    await env.CONFIGURATION_KV.put(
      listKey,
      JSON.stringify(list)
    );
  }

  // =========================
  // RESPONSE
  // =========================
  return json(
    { ok: true, configurationId },
    request,
    env
  );
}
