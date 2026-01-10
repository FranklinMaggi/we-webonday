/**
 * ======================================================
 * BE || ROUTES || ADMIN || PRODUCTS — REGISTER
 * File: backend/src/routes/admin/products/registerProducts.ts
 * ======================================================
 *
 * RUOLO:
 * - Crea o aggiorna un Product nel catalogo
 *
 * SECURITY:
 * - Accesso: ADMIN (requireAdmin)
 *
 * NOTE:
 * - Endpoint legacy: PUT /api/products/register
 * - Il path NON è sotto /api/admin per retrocompatibilità
 *
 * PIPELINE:
 * 1) Admin guard
 * 2) JSON parse
 * 3) normalizeProduct
 * 4) Domain validation (ProductSchema)
 * 5) KV upsert atomico
 *
 * KV:
 * - PRODUCTS_KV
 * ======================================================
 */

import type { Env } from "../../../types/env";
import { normalizeProductInput } from "../../../domains/product/product.input.normalizer";
import { ProductSchema } from "../../../domains/product/product.schema";
import type { Product } from "../../../domains/product/product.schema";
import { requireAdmin } from "../guard/admin.guard";
import { OptionSchema } from "../../../domains/option/option.schema.ts";

export async function registerAdminProduct(
  request: Request,
  env: Env
): Promise<Product> {
  const guard = requireAdmin(request, env);
  if (guard) throw new Error("UNAUTHORIZED");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new Error("INVALID_JSON");
  }

  if (!body || typeof body !== "object" || !("id" in body)) {
    throw new Error("MISSING_PRODUCT_ID");
  }

  // 1️⃣ NORMALIZER
  const normalized = normalizeProductInput(body);

  // 2️⃣ TIMESTAMPS
  const now = new Date().toISOString();
  const withTimestamps = {
    ...normalized,
    createdAt: normalized.createdAt ?? now,
    updatedAt: now,
  };

  // 3️⃣ VALIDATE OPTIONS
  if (normalized.optionIds.length) {
    for (const optionId of normalized.optionIds) {
      const raw = await env.OPTIONS_KV.get(`OPTION:${optionId}`);
      if (!raw) {
        throw new Error(`OPTION_NOT_FOUND:${optionId}`);
      }

      const option = OptionSchema.parse(JSON.parse(raw));
      if (option.status !== "ACTIVE") {
        throw new Error(`OPTION_NOT_ACTIVE:${optionId}`);
      }
    }
  }

  // 4️⃣ VALIDAZIONE CORE
  const validated = ProductSchema.parse(withTimestamps);

  // 5️⃣ UPSERT
  await env.PRODUCTS_KV.put(
    `PRODUCT:${validated.id}`,
    JSON.stringify(validated)
  );

  return validated;
}
