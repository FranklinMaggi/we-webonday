//schemas/core/ProductSchema.ts
// DOMAIN: CORE (WebOnDay Products — SOURCE OF TRUTH)

import { z } from "zod";

/* =========================
   OPTION
========================= */
export const ProductOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["one_time", "yearly", "monthly"]),
  price: z.number().nonnegative(),
});

/* =========================
   PRICING
========================= */
export const ProductPricingSchema = z.object({
  yearly: z.number().nonnegative().default(0),
  monthly: z.number().nonnegative().default(0),
});

/* =========================
   PRODUCT (DOMAIN)
========================= */
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().default(""),

  // una tantum
  startupFee: z.number().nonnegative().default(0),

  // canoni
  pricing: ProductPricingSchema.default({
    yearly: 0,
    monthly: 0,
  }),

  deliveryTime: z.string().optional().default(""),
  flags: z.array(z.string()).default([]),

  options: z.array(ProductOptionSchema).default([]),
});

export type Product = z.infer<typeof ProductSchema>;
