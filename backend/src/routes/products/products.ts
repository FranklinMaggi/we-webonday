// backend/src/routes/products.ts
import type { Env } from "../../types/env";

import { normalizeProduct } from "../../normalizers/normalizeProduct";
import { ProductSchema } from "../../schemas/food/productSchema";

/* ============================================================
   GET ALL PRODUCTS (DOMAIN ONLY)
   ============================================================ */
export async function getProducts(env: Env) {
  const list = await env.PRODUCTS_KV.list({ prefix: "PRODUCT:" });

  const rawProducts: any[] = [];

  for (const item of list.keys) {
    const data = await env.PRODUCTS_KV.get(item.name);
    if (data) rawProducts.push(JSON.parse(data));
  }

  const normalized = rawProducts.map(normalizeProduct);
  const validated = normalized.map((p) => ProductSchema.parse(p));

  return validated;
}

/* ============================================================
   GET SINGLE PRODUCT (DOMAIN ONLY)
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
  const validated = ProductSchema.parse(normalized);

  return validated;
}

/* ============================================================
   REGISTER / UPDATE PRODUCT (DOMAIN ONLY)
   ============================================================ */
export async function registerProduct(
  request: Request,
  env: Env
) {
  let body: any;

  try {
    body = await request.json();
  } catch {
    throw new Error("Invalid JSON body");
  }

  if (!body.id) {
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
