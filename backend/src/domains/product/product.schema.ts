/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || PRODUCT || SCHEMA
======================================================

RUOLO:
- Source of Truth del dominio Product
- Definisce struttura, vincoli e default di dominio

INVARIANTI:
- Ogni Product persistito DEVE validare questo schema
- createdAt / updatedAt sono parte del dominio
- optionIds sono SOLO riferimenti (nessun join)

NON DEVE:
- NON normalizzare input
- NON conoscere OptionSchema
- NON conoscere frontend o API

USATO DA:
- registerProduct
- getProducts
- getProduct
====================================================== */

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
    // 🆕 CHIAVI SEMANTICHE (NON OBBLIGATORIE)
    nameKey: z.string().optional(),
    descriptionKey: z.string().optional(),
  startupFee: z.number().nonnegative().default(0),

  pricing: ProductPricingSchema.default({
    yearly: 0,
    monthly: 0,
  }),

 
  optionIds: z.array(z.string()).default([]),

  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  configuration: z.boolean().default(false),
  // ✅ TIMESTAMPS DI DOMINIO
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Product = z.infer<typeof ProductSchema>;
