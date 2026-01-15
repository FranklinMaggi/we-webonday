// ======================================================
// BACKEND || ADMIN — PRODUCT OPTIONS UPDATE
// File: backend/src/routes/admin/products.options.update.ts
// ======================================================
//
// SCOPO:
// - Aggiornare l’elenco optionIds associati a un prodotto
// - Mutazione ATOMICA e CONTROLLATA
//
// REGOLE:
// - Tutte le option devono:
//   - esistere
//   - essere ACTIVE
// - Nessuna modifica parziale
// - Aggiorna sempre updatedAt
//
// NON FA:
// - NON crea option
// - NON modifica option
// - NON calcola prezzi
//
// USO:
// - Admin dashboard (editor prodotto)
//
// ======================================================
// ============================================================
// AI-SUPERCOMMENT
// ADMIN || PRODUCT OPTIONS UPDATE
// ============================================================
//
// RESPONSABILITÀ:
// - Associare optionIds a un Product
// - Sovrascrittura completa (source of truth = payload)
//
// INPUT:
// - productId
// - optionIds[]
//
// NON FA:
// - NON valida compatibilità option/product
// - NON filtra per status option
//
// PERCHE:
// - Admin ha pieno controllo
// - Le regole vivono nei CU (Project / Cart)
//
// NOTA:
// - optionIds è un riferimento debole (string[])
// - join avviene solo in read routes
// ============================================================

import type { Env } from "../../../types/env";
import { z } from "zod";
import { requireAdmin } from "../../../domains/auth/route/admin/guard/admin.guard";
import { ProductSchema } from "../../../domains/product/product.schema";
import { OptionSchema } from "../../../domains/option/option.schema.ts";

/* =========================
   SCHEMA INPUT
========================= */
const UpdateProductOptionsSchema = z.object({
  productId: z.string().min(1),
  optionIds: z.array(z.string()).default([]),
});

/* =========================
   JSON helper locale
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ======================================================
   POST /api/admin/product/options/update
====================================================== */
export async function updateProductOptions(
  request: Request,
  env: Env
): Promise<Response> {

  /* =====================
     1️⃣ ADMIN GUARD
  ====================== */
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  /* =====================
     2️⃣ PARSE BODY
  ====================== */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, 400);
  }

  const parsed = UpdateProductOptionsSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "INVALID_PAYLOAD",
        issues: parsed.error.format(),
      },
      400
    );
  }

  const { productId, optionIds } = parsed.data;

  /* =====================
     3️⃣ LOAD PRODUCT
  ====================== */
  const rawProduct = await env.PRODUCTS_KV.get(`PRODUCT:${productId}`);
  if (!rawProduct) {
    return json(
      { ok: false, error: "PRODUCT_NOT_FOUND" },
      404
    );
  }

  let product;
  try {
    product = ProductSchema.parse(JSON.parse(rawProduct));
  } catch {
    return json(
      { ok: false, error: "CORRUPTED_PRODUCT" },
      500
    );
  }

  /* =====================
     4️⃣ VALIDATE OPTIONS
  ====================== */
  const resolvedOptions = [];

  for (const optionId of optionIds) {
    const rawOption = await env.OPTIONS_KV.get(`OPTION:${optionId}`);

    if (!rawOption) {
      return json(
        {
          ok: false,
          error: "OPTION_NOT_FOUND",
          optionId,
        },
        409
      );
    }

    let option;
    try {
      option = OptionSchema.parse(JSON.parse(rawOption));
    } catch {
      return json(
        {
          ok: false,
          error: "CORRUPTED_OPTION",
          optionId,
        },
        500
      );
    }

    if (option.status !== "ACTIVE") {
      return json(
        {
          ok: false,
          error: "OPTION_NOT_ACTIVE",
          optionId,
        },
        409
      );
    }

    resolvedOptions.push(option);
  }

  /* =====================
     5️⃣ UPDATE PRODUCT
  ====================== */
  const updatedProduct = ProductSchema.parse({
    ...product,
    optionIds,
    updatedAt: new Date().toISOString(),
  });

  await env.PRODUCTS_KV.put(
    `PRODUCT:${updatedProduct.id}`,
    JSON.stringify(updatedProduct)
  );

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json({
    ok: true,
    product: updatedProduct,
    optionsCount: optionIds.length,
  });
}
