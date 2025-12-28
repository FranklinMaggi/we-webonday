// BE || routes/products/products.ts
// ======================================================
// PRODUCTS ROUTES — CORE DOMAIN (WebOnDay)
// ======================================================
//
// CONNECT POINT (CRITICO):
// - Espone i prodotti WebOnDay (NON tenant, NON food)
// - Legge da PRODUCTS_KV
// - Normalizza dati legacy
// - Valida SEMPRE con ProductSchema (CORE = source of truth)
//
// NON FA:
// - business logic
// - pricing dinamico
// - override tenant
//
// ======================================================

import type { Env } from "../../types/env";

import { normalizeProduct } from "../../normalizers/normalizeProduct";
import { ProductSchema } from "../../schemas/core/productSchema";

/* ============================================================
   GET ALL PRODUCTS
   GET /api/products
============================================================ */
export async function getProducts(env: Env) {
  const list = await env.PRODUCTS_KV.list({ prefix: "PRODUCT:" });

  const products = [];

  for (const item of list.keys) {
    const data = await env.PRODUCTS_KV.get(item.name);
    if (!data) continue;

    try {
      const raw = JSON.parse(data);
      const normalized = normalizeProduct(raw);

      // PERCHE: lo schema CORE è la verità assoluta
      const validated = ProductSchema.parse(normalized);

      products.push(validated);
    } catch (err) {
      // PERCHE: un prodotto rotto non deve bloccare tutto il catalogo
      console.error("[PRODUCT INVALID]", item.name, err);
    }
  }

  return products;
}

/* ============================================================
   GET SINGLE PRODUCT
   GET /api/product?id=XXX
============================================================ */
export async function getProduct(request: Request, env: Env) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    throw new Error("Missing product id");
  }

  const data = await env.PRODUCTS_KV.get(`PRODUCT:${id}`);
  if (!data) {
    throw new Error("Product not found");
  }

  const raw = JSON.parse(data);
  const normalized = normalizeProduct(raw);

  // PERCHE: singolo prodotto → errore esplicito se invalido
  return ProductSchema.parse(normalized);
}

/* ============================================================
   REGISTER / UPDATE PRODUCT
   POST /api/products
============================================================ */
export async function registerProduct(request: Request, env: Env) {
  let body: any;

  try {
    body = await request.json();
  } catch {
    throw new Error("Invalid JSON body");
  }

  if (!body?.id) {
    throw new Error("Missing product id");
  }

  const normalized = normalizeProduct(body);
  const validated = ProductSchema.parse(normalized);

  await env.PRODUCTS_KV.put(
    `PRODUCT:${validated.id}`,
    JSON.stringify(validated)
  );

  return validated;
}
