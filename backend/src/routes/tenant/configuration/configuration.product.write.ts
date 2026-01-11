// ======================================================
// BE || POST /api/configuration/from-cart
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION CREATION (CANONICAL)
//
// RUOLO:
// - Punto di ingresso UNICO dal frontend (ProductCard)
// - Crea una Configuration "draft" deterministica
// - NON dipende dal Cart (il Cart è solo un pointer)
// - È idempotente per businessName + solutionId
//
// SOURCE OF TRUTH:
// - SolutionSchema
// - ProductSchema
// - OptionSchema
// - ConfigurationSchema
//
// INVARIANTI (NON NEGOZIABILI):
// 1. ConfigurationId è deterministico (slug)
// 2. Se esiste già → viene riutilizzato
// 3. Nessuna logica di checkout
// 4. Nessuna creazione Business definitiva
// 5. Tutti i dati FE finiscono in `configuration.data`
//
// FLOW:
// ProductCard
//   → POST /configuration/from-cart
//   → CONFIGURATION_KV
//   → redirect /user/configurator/:id
//
// ======================================================

import { z } from "zod";
import type { Env } from "../../../types/env";

import { requireUser } from "../../../lib/auth/session";

import { SolutionSchema } from "../../../domains/solution/solution.schema";
import { ProductSchema } from "../../../domains/product/product.schema";
import { OptionSchema } from "../../../domains/option/option.schema";

import {
  ConfigurationSchema,
  configurationKey,
  userConfigurationsKey,
  buildConfigurationId,
} from "./configuration/configuration.schema";

/* =========================
   INPUT VALIDATION
========================= */
const InputSchema = z.object({
  businessName: z.string().min(2),
  solutionId: z.string().min(1),
  productId: z.string().min(1),
  optionIds: z.array(z.string()).default([]),
});

/* =========================
   HANDLER
========================= */
export async function createConfigurationFromCart(
  req: Request,
  env: Env
) {
  /* =========================
     AUTH — REQUIRED
  ========================= */
  const auth = await requireUser(req, env);
  if (!auth) {
    return Response.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const { userId } = auth;

  /* =========================
     PARSE INPUT
  ========================= */
  const body = InputSchema.parse(await req.json());

  /* =========================
     LOAD SOLUTION
  ========================= */
  const rawSolution = await env.SOLUTIONS_KV.get(
    `SOLUTION:${body.solutionId}`
  );

  if (!rawSolution) {
    return Response.json(
      { ok: false, error: "SOLUTION_NOT_FOUND" },
      { status: 404 }
    );
  }

  const solution = SolutionSchema.parse(
    JSON.parse(rawSolution)
  );

  /* =========================
     LOAD PRODUCT
  ========================= */
  const rawProduct = await env.PRODUCTS_KV.get(
    `PRODUCT:${body.productId}`
  );

  if (!rawProduct) {
    return Response.json(
      { ok: false, error: "PRODUCT_NOT_FOUND" },
      { status: 404 }
    );
  }

  const product = ProductSchema.parse(
    JSON.parse(rawProduct)
  );

  /* =========================
     LOAD OPTIONS (SNAPSHOT)
     - tollerante: opzioni mancanti vengono ignorate
  ========================= */
  const options = [];

  for (const optId of body.optionIds) {
    const rawOpt = await env.OPTIONS_KV.get(
      `OPTION:${optId}`
    );
    if (!rawOpt) continue;

    options.push(
      OptionSchema.parse(JSON.parse(rawOpt))
    );
  }

  /* =========================
     BUILD CONFIGURATION ID
     (DETERMINISTIC)
  ========================= */
  const configurationId = buildConfigurationId(
    body.businessName,
    solution.id
  );

  const key = configurationKey(configurationId);

  /* =========================
     IDEMPOTENCY CHECK
  ========================= */
  const existing = await env.CONFIGURATION_KV.get(key);
  if (existing) {
    return Response.json({
      ok: true,
      configurationId,
      reused: true,
    });
  }

  /* =========================
     BUILD CONFIGURATION (DRAFT)
  ========================= */
  const now = new Date().toISOString();

  const configuration = ConfigurationSchema.parse({
    id: configurationId,
    userId,

    solutionId: solution.id,
    productId: product.id,
    options: body.optionIds,

    data: {
      solution,
      product,
      options,

      business: {
        name: body.businessName,
        sector: solution.industries?.[0] ?? "",
        city: "",
        email: "",
      },

      setup: {},
      ai: { status: "pending" },
    },

    status: "draft",
    createdAt: now,
    updatedAt: now,
  });

  /* =========================
     PERSISTENCE
  ========================= */
  await env.CONFIGURATION_KV.put(
    key,
    JSON.stringify(configuration)
  );

  const userKey = userConfigurationsKey(userId);
  const list = JSON.parse(
    (await env.CONFIGURATION_KV.get(userKey)) ?? "[]"
  );

  if (!list.includes(configurationId)) {
    await env.CONFIGURATION_KV.put(
      userKey,
      JSON.stringify([...list, configurationId])
    );
  }

  /* =========================
     RESPONSE
  ========================= */
  return Response.json({
    ok: true,
    configurationId,
    reused: false,
  });
}
