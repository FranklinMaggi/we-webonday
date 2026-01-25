/**
 * ======================================================
 * BE || ROUTES || PUBLIC || PRODUCT + OPTIONS
 * File: backend/src/routes/public/products/product.withOptions.ts
 * ======================================================
 *
 * RUOLO:
 * - Espone UN prodotto pubblico con le sue opzioni
 *
 * NON FA:
 * - NON espone prodotti non ACTIVE
 * - NON espone opzioni non ACTIVE
 * - NON scrive su KV
 *
 * SECURITY:
 * - Accesso: PUBLIC
 *
 * PIPELINE:
 * 1) Lettura productId da query
 * 2) Load prodotto da PRODUCTS_KV
 * 3) ProductSchema.parse
 * 4) Public guard (status === ACTIVE)
 * 5) Risoluzione optionIds → options[]
 *
 * KV:
 * - PRODUCTS_KV
 * - OPTIONS_KV
 *
 * CONNECT POINTS:
 * - backend/src/index.ts → GET /api/product/with-options?id=XXX
 * - FE: product detail / configuration
 * ======================================================
 */




import type { Env } from "../../../types/env";
import { ProductSchema } from "../product.schema";
import { OptionSchema } from "../../option/option.schema.ts";

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
    
    if (product.isVisitor !== true) {
      return response({ ok: false, error: "PRODUCT_NOT_PUBLIC" }, 403);
    
    }

    const options = [];

    for (const optionId of product.optionIds) {
      const rawOpt = await env.OPTIONS_KV.get(`OPTION:${optionId}`);
      if (!rawOpt) continue;

      const opt = OptionSchema.parse(JSON.parse(rawOpt));
      if (opt.status !== "ACTIVE") continue;

      options.push({
        id: opt.id,
        label: opt.name,
        description: opt.description ?? "",
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
        configuration: product.configuration,
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
