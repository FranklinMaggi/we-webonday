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
/* =========================================================
   AI_SUPERCOMMENT — ADMIN PRODUCTS LIST / DETAIL
   =========================================================
   DOMINIO:
   - CRUD amministrativo dei PRODUCT
   - Product = offerta commerciale base (SaaS / Project template)

   PERCHÉ ESISTE:
   - Gestione catalogo commerciale
   - Attivazione / archiviazione prodotti
   - Pricing e startupFee

   NON FA:
   - NON include option runtime
   - NON calcola prezzi finali
   - NON crea Project

   KV:
   - PRODUCTS_KV

   NOTE:
   - optionIds qui rappresenta SOLO il binding configurativo
     (non implica che l’option sia attiva su un Project)
========================================================= */
// ============================================================
// AI-SUPERCOMMENT
// ADMIN || PRODUCTS (READ ONLY)
// ============================================================
//
// RESPONSABILITÀ:
// - Listing prodotti
// - Lettura singolo prodotto (flat)
//
// DIFFERENZA con product.withOptions:
// - QUI: solo Product
// - withOptions: Product + Option entities
//
// PERCHE:
// - Tabelle admin (veloci)
// - Editor dettagliato separato
// ============================================================

import type { Env } from "../../../types/env";
import { z } from "zod";
import { ProductSchema } from "../../../schemas/core/productSchema";
import { requireAdmin } from "../admin.guard";

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
