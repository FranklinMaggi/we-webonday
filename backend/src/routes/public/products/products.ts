/**
 * ======================================================
 * BE || ROUTES || PUBLIC+ADMIN || PRODUCTS (LEGACY MIXED)
 * File: backend/src/routes/public/products/products.ts
 * ======================================================
 *
 * RUOLO:
 * - Espone prodotti pubblici
 * - Contiene anche registerProduct (ADMIN)
 *
 * NOTE IMPORTANTI:
 * - File legacy misto (read public + write admin)
 * - Verrà separato in tranche successiva
 * - NON rifattorizzare ora
 *
 * SECURITY:
 * - PUBLIC: solo prodotti ACTIVE
 * - ADMIN: requireAdmin su register
 *
 * CONNECT POINTS:
 * - backend/src/index.ts → /api/products
 * ======================================================
 */


import type { Env } from "../../../types/env";
import { normalizeProductInput } from "../../../domains/product/product.input.normalizer";
import { ProductSchema } from "../../../domains/product/product.schema";
import type { Product } from "../../../domains/product/product.schema";
import { requireAdmin } from "../../../domains/auth/route/admin/guard/admin.guard";
import { OptionSchema } from "../../../domains/option/option.schema.ts";
/* ============================================================
   GET ALL PRODUCTS (PUBLIC)
   GET /api/products
============================================================ */
export async function getProducts(env: Env): Promise<Product[]> {
  const list = await env.PRODUCTS_KV.list({ prefix: "PRODUCT:" });
  const products: Product[] = [];

  for (const item of list.keys) {
    const data = await env.PRODUCTS_KV.get(item.name);
    if (!data) continue;

    try {
      const raw = JSON.parse(data);
      const normalized = normalizeProductInput(raw);
      const validated = ProductSchema.parse(normalized);

      // 🔒 Guard pubblico
      if (validated.status === "ACTIVE") {
        products.push(validated);
      }

    } catch (err) {
      console.error("[PUBLIC PRODUCT INVALID]", item.name, err);
    }
  }

  return products;
}

/* ============================================================
   GET SINGLE PRODUCT (PUBLIC)
   GET /api/product?id=XXX
============================================================ */
export async function getProduct(
  request: Request,
  env: Env
): Promise<Product> {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) throw new Error("Missing product id");

  const raw = await env.PRODUCTS_KV.get(`PRODUCT:${id}`);
  if (!raw) throw new Error("Product not found");

  const normalized = normalizeProductInput(JSON.parse(raw));
  return ProductSchema.parse(normalized);
}

