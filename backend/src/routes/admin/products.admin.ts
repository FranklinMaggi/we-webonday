// backend/src/routes/admin/products.admin.ts
// ======================================================
// ADMIN — PRODUCTS
// ======================================================
//
// RESPONSABILITÀ:
// - Listing prodotti (tutti gli stati)
// - Create prodotto
// - Update prodotto
// - Archiviazione logica
//
// PRINCIPI:
// - Backend = source of truth
// - KV contiene SOLO ProductSchema valido
// - Nessun legacy write
// ======================================================

import type { Env } from "../../types/env";
import { z } from "zod";
import { ProductSchema } from "../../schemas/core/productSchema";
import { requireAdmin } from "./admin.guard";

/* =========================
   JSON HELPER
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ======================================================
   GET /api/admin/products/list
====================================================== */
export async function listAdminProducts(
  request: Request,
  env: Env
): Promise<Response> {
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  const list = await env.PRODUCTS_KV.list({ prefix: "PRODUCT:" });
  const products = [];

  for (const key of list.keys) {
    const raw = await env.PRODUCTS_KV.get(key.name);
    if (!raw) continue;

    try {
      const parsed = ProductSchema.parse(JSON.parse(raw));
      products.push(parsed);
    } catch (err) {
      console.error("Invalid PRODUCT in KV:", key.name, err);
    }
  }

  return json({ ok: true, products });
}

/* ======================================================
   POST /api/admin/products/create
====================================================== */
const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});



/* ======================================================
   PUT /api/admin/products/update
====================================================== */


/* ======================================================
   POST /api/admin/products/archive
====================================================== */
const ArchiveSchema = z.object({
  id: z.string().min(1),
});

/* ======================================================
   GET /api/admin/product?id=XXX
   (DETAIL — ALL STATUSES)
====================================================== */
export async function getAdminProduct(
  request: Request,
  env: Env
): Promise<Response> {
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return json({ ok: false, error: "MISSING_PRODUCT_ID" }, 400);
  }

  const raw = await env.PRODUCTS_KV.get(`PRODUCT:${id}`);
  if (!raw) {
    return json({ ok: false, error: "PRODUCT_NOT_FOUND" }, 404);
  }

  try {
    const product = ProductSchema.parse(JSON.parse(raw));
    return json({ ok: true, product });
  } catch (err) {
    console.error("Invalid PRODUCT in KV:", id, err);
    return json({ ok: false, error: "CORRUPTED_PRODUCT" }, 500);
  }
}
