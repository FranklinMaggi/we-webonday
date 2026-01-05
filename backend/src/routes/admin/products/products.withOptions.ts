// backend/src/routes/admin/products.withOptions.ts
// ======================================================
// ADMIN — PRODUCT WITH OPTIONS (READ VIEW)
// ======================================================
//
// SCOPO:
// - Restituire un prodotto con le sue option RISOLTE
// - Endpoint di SOLA LETTURA per dashboard admin
//
// NON FA:
// - NON scrive su KV
// - NON valida dominio (già garantito a monte)
// - NON applica logica di business
//
// USO:
// - Admin dashboard
// - Editor prodotto
// ======================================================
/* =========================================================
   AI_SUPERCOMMENT — ADMIN PRODUCT WITH OPTIONS (DETAIL)
   =========================================================
   DOMINIO:
   - Lettura DETTAGLIO di un singolo product
   - Include:
     - product
     - option collegate (configurative)

   PERCHÉ ESISTE:
   - UI admin → pagina dettaglio prodotto
   - Gestione associazioni option ↔ product

   CONTRATTO HTTP:
   - GET /api/admin/product/with-options
   - REQUIRE: ?productId=XXX

   ERRORI INTENZIONALI:
   - MISSING_PRODUCT_ID → 400
     ❗ NON È UN BUG
     ❗ Endpoint NON è un listing

   NON FA:
   - NON ritorna tutti i product
   - NON applica logica project
   - NON valuta compatibilità option

   KV:
   - PRODUCTS_KV
   - OPTIONS_KV
========================================================= */

import type { Env } from "../../../types/env";
import { ProductSchema } from "../../../schemas/core/productSchema";
import { OptionSchema } from "../../../schemas/core/optionSchema";
import { requireAdmin } from "../admin.guard";

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
   GET /api/admin/product/with-options?id=XXX
====================================================== */
export async function getAdminProductWithOptions(
  request: Request,
  env: Env
): Promise<Response> {

  /* 🔒 ADMIN GUARD */
  const denied = requireAdmin(request, env);
  if (denied) return denied;

  /* 📌 PARAM */
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return json({ ok: false, error: "MISSING_PRODUCT_ID" }, 400);
  }

  /* 📦 LOAD PRODUCT */
  const rawProduct = await env.PRODUCTS_KV.get(`PRODUCT:${id}`);
  if (!rawProduct) {
    return json({ ok: false, error: "PRODUCT_NOT_FOUND" }, 404);
  }

  let product;
  try {
    product = ProductSchema.parse(JSON.parse(rawProduct));
  } catch (err) {
    console.error("CORRUPTED PRODUCT:", id, err);
    return json({ ok: false, error: "CORRUPTED_PRODUCT" }, 500);
  }

  /* 🔗 RESOLVE OPTIONS */
  const options = [];

  for (const optionId of product.optionIds) {
    const rawOption = await env.OPTIONS_KV.get(`OPTION:${optionId}`);
    if (!rawOption) {
      // option mancante → NON blocca (vista admin)
      options.push({
        id: optionId,
        missing: true,
      });
      continue;
    }

    try {
      options.push(OptionSchema.parse(JSON.parse(rawOption)));
    } catch (err) {
      console.error("CORRUPTED OPTION:", optionId, err);
      options.push({
        id: optionId,
        corrupted: true,
      });
    }
  }

  /* ✅ RESPONSE */
  return json({
    ok: true,
    product,
    options,
  });
}
