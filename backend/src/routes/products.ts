import type { Env } from "../types/env";

import { normalizeProduct } from "../normalizers/normalizeProduct";
import { ProductSchema } from "../schemas/productSchema";


function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    },
  });
}


/* ============================================================
   GET ALL PRODUCTS
   ============================================================ */
export async function getProducts(env: Env): Promise<Response> {
  const list = await env.PRODUCTS_KV.list({ prefix: "PRODUCT:" });

  const rawProducts: any[] = [];

  for (const item of list.keys) {
    const data = await env.PRODUCTS_KV.get(item.name);
    if (data) rawProducts.push(JSON.parse(data));
  }

  const normalized = rawProducts.map(normalizeProduct);

  const validated = normalized.map((p) => ProductSchema.parse(p));

  return json(validated);
}


/* ============================================================
   GET SINGLE PRODUCT
   ============================================================ */
export async function getProduct(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) return json({ error: "Missing id" }, 400);

  const data = await env.PRODUCTS_KV.get(`PRODUCT:${id}`);
  if (!data) return json({ error: "Not found" }, 404);

  const raw = JSON.parse(data);

  const normalized = normalizeProduct(raw);

  const validated = ProductSchema.parse(normalized);

  return json(validated);
}


/* ============================================================
   REGISTER / UPDATE PRODUCT
   ============================================================ */
export async function registerProduct(
  request: Request,
  env: Env
): Promise<Response> {
  let body: any = null;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!body.id) {
    return json({ error: "Missing product ID" }, 400);
  }

  const normalized = normalizeProduct(body);

  const validated = ProductSchema.parse(normalized);

  await env.PRODUCTS_KV.put(
    `PRODUCT:${validated.id}`,
    JSON.stringify(validated)
  );

  return json({ ok: true, product: validated });
}
