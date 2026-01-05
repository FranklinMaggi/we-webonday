// ======================================================
// BACKEND || PRODUCTS — PUBLIC VIEW WITH OPTIONS
// File: routes/products/products.withOptions.ts
// ======================================================
//
// SCOPO:
// - Esporre prodotti PUBLIC con option RISOLTE
// - Read-only
//
// NON FA:
// - NON scrive
// - NON valida business
// - NON normalizza legacy
//
// ======================================================

import type { Env } from "../../types/env";
import { ProductSchema } from "../../schemas/core/productSchema";
import { OptionSchema } from "../../schemas/core/optionSchema";

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

      // 🔒 PUBLIC GUARD
      if (product.status !== "ACTIVE") continue;

      const options = [];

      for (const optionId of product.optionIds) {
        const rawOpt = await env.OPTIONS_KV.get(`OPTION:${optionId}`);
        if (!rawOpt) continue;

        const opt = OptionSchema.parse(JSON.parse(rawOpt));
        if (opt.status !== "ACTIVE") continue;

        options.push({
          id: opt.id,
          label: opt.name,
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
