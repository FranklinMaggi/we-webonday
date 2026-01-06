/* ======================================================
   BACKEND || Products Routes — CORE DOMAIN
======================================================

SCOPO:
- Esporre i prodotti WebOnDay tramite API
- Gestire lettura pubblica e scrittura admin
- Garantire che solo dati validi entrino nel sistema

RESPONSABILITÀ:
- Lettura prodotti da PRODUCTS_KV
- Normalizzazione input (normalizeProduct)
- Validazione dominio (ProductSchema)
- Scrittura atomica (upsert)

REGOLE DI ACCESSO:
- PUBLIC:
  - vede SOLO prodotti con status === "ACTIVE"
- ADMIN:
  - può creare / aggiornare prodotti
  - passa SEMPRE da registerProduct

FLUSSO REGISTER:
1. Auth admin
2. JSON parse
3. normalizeProduct
4. Iniezione timestamps di dominio
5. ProductSchema.parse (fail-fast)
6. Persistenza in KV

TIMESTAMPS:
- createdAt: impostato solo alla prima creazione
- updatedAt: aggiornato a ogni save
- Mai gestiti dal frontend

NON DEVE FARE:
- NON fidarsi del frontend
- NON salvare dati non validati
- NON esporre prodotti non ACTIVE al pubblico

NOTE:
- Se ProductSchema rifiuta → 500 = sistema sano
====================================================== */

import type { Env } from "../../types/env";
import { normalizeProduct } from "../../normalizers/normalizeProduct";
import { ProductSchema } from "../../schemas/core/productSchema";
import type { Product } from "../../schemas/core/productSchema";
import { requireAdmin } from "../admin/guard/admin.guard";
import { OptionSchema } from "../../schemas/core/optionSchema";
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
      const normalized = normalizeProduct(raw);
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

  const normalized = normalizeProduct(JSON.parse(raw));
  return ProductSchema.parse(normalized);
}

/* ============================================================
   REGISTER / UPDATE PRODUCT (ADMIN ONLY)
   PUT /api/products/register
============================================================ */
// BE || routes/products/products.ts

export async function registerProduct(
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

  // 1️⃣ NORMALIZER (legacy / FE → shape coerente)
  const normalized = normalizeProduct(body);

  // 2️⃣ TIMESTAMPS (DOMINIO)
  const now = new Date().toISOString();

  const withTimestamps = {
    ...normalized,
    createdAt: normalized.createdAt ?? now, // solo prima volta
    updatedAt: now,                          // sempre
  };
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
  
  // 3️⃣ VALIDAZIONE CORE (SOURCE OF TRUTH)
  const validated = ProductSchema.parse(withTimestamps);

  // 4️⃣ UPSERT
  await env.PRODUCTS_KV.put(
    `PRODUCT:${validated.id}`,
    JSON.stringify(validated)
  );

  return validated;
}


