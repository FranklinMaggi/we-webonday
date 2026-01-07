// ======================================================
// BACKEND || PRODUCT — PUBLIC DETAIL WITH OPTIONS
// ======================================================
//
// SCOPO:
// - Esporre un singolo prodotto pubblico
// - Risolvere le optionIds → options[]
//
// REGOLE:
// - SOLO status === ACTIVE
// - READ-ONLY
// - NO legacy write
//
// ======================================================
// ============================================================
// AI-SUPERCOMMENT
// ADMIN || PRODUCT + OPTIONS (READ)
// ============================================================
//
// RESPONSABILITÀ:
// - Caricare un prodotto ADMIN
// - Risolvere le optionIds → Option entities
//
// INPUT:
// - Query param: id (productId)
//
// OUTPUT:
// {
//   ok: true,
//   product: Product,
//   options: Option[]
// }
//
// NON FA:
// - NON muta stato
// - NON filtra per status (ADMIN vede tutto)
// - NON valida pricing o compatibilità
//
// EDGE CASES:
// - product non trovato → 404
// - optionId dangling → ignorata + log
//
// PERCHE:
// - Admin deve vedere configurazione reale del prodotto
// - Anche opzioni ARCHIVED servono per audit
// ============================================================

import type { Env } from "../../types/env";
import { ProductSchema } from "../../schemas/core/productSchema";
import { OptionSchema } from "../../schemas/core/optionSchema";

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function getProductWithOptions(
  request: Request,
  env: Env
): Promise<Response> {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return response({ ok: false, error: "MISSING_PRODUCT_ID" }, 400);
  }

  const raw = await env.PRODUCTS_KV.get(`PRODUCT:${id}`);
  if (!raw) {
    return response({ ok: false, error: "PRODUCT_NOT_FOUND" }, 404);
  }

  try {
    const product = ProductSchema.parse(JSON.parse(raw));

    if (product.status !== "ACTIVE") {
      return response({ ok: false, error: "PRODUCT_NOT_ACTIVE" }, 403);
    }

    const options = [];

    for (const optionId of product.optionIds) {
      const rawOpt = await env.OPTIONS_KV.get(`OPTION:${optionId}`);
      if (!rawOpt) continue;

      const opt = OptionSchema.parse(JSON.parse(rawOpt));
      if (opt.status !== "ACTIVE") continue;

      options.push({
        id: opt.id,
        name: opt.name,
        price: opt.price,
        type:
          opt.payment.mode === "one_time"
            ? "one_time"
            : opt.payment.interval === "monthly"
            ? "monthly"
            : "yearly",
      });
    }

    return response({
      ok: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        nameKey: product.nameKey,
        descriptionKey: product.descriptionKey,
        status: product.status,
        startupFee: product.startupFee,
        pricing: product.pricing,
       
        
        options,
      },
    });
  } catch (err) {
    console.error("[PRODUCT WITH OPTIONS ERROR]", id, err);
    return response({ ok: false, error: "CORRUPTED_PRODUCT" }, 500);
  }
}
