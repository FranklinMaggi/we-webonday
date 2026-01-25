/**
 * ======================================================
 * BE || ROUTES || PUBLIC || PRODUCTS + OPTIONS
 * File: backend/src/routes/public/products/products.withOptions.ts
 * ======================================================
 *
 * RUOLO:
 * - Espone prodotti pubblici con opzioni risolte
 *
 * REGOLE:
 * - Espone SOLO prodotti con status === "ACTIVE"
 * - Espone SOLO opzioni con status === "ACTIVE"
 *
 * NON FA:
 * - Non scrive su KV
 * - Non autentica utenti
 *
 * SECURITY:
 * - Accesso: PUBLIC
 *
 * CONNECT POINTS:
 * - backend/src/index.ts → GET /api/products/with-options
 * ======================================================
 */



import type { Env } from "../../../types/env";
import { ProductSchema } from "../product.schema";
import { OptionSchema } from "../../option/option.schema.ts";

export async function getProductsWithOptions(
  env: Env
) {
  const list = await env.PRODUCTS_KV.list({ prefix: "PRODUCT:" });
  const products = [];

  for (const item of list.keys) {
    const raw = await env.PRODUCTS_KV.get(item.name);
    if (!raw) continue;

    try {
      const product = ProductSchema.parse(JSON.parse(raw));

        // 🔒 PUBLIC + VISITOR GUARD
        if (product.status !== "ACTIVE") continue;
        if (product.isVisitor !== true) continue;


      const options = [];

      for (const optionId of product.optionIds) {
        const rawOpt = await env.OPTIONS_KV.get(`OPTION:${optionId}`);
        if (!rawOpt) continue;

        const opt = OptionSchema.parse(JSON.parse(rawOpt));
        if (opt.status !== "ACTIVE") continue;

        options.push({
          id: opt.id,
          name: opt.name,
          description:opt.description,
          price: opt.price,
          type:
            opt.payment.mode === "one_time"
              ? "one_time"
              : opt.payment.interval === "monthly"
              ? "monthly"
              : "yearly",
        });
      }

      products.push({
        id: product.id,
        name: product.name,
        description: product.description,
        nameKey: product.nameKey,
        descriptionKey: product.descriptionKey,
        status: product.status,
        configuration: product.configuration,
        startupFee: product.startupFee,
        pricing: product.pricing,
        
        options,
      });

    } catch (err) {
      console.error("[PUBLIC PRODUCT WITH OPTIONS INVALID]", item.name, err);
    }
  }

  return products;
}
