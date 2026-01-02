/* ======================================================
   DOMAIN || ProductSchema — SOURCE OF TRUTH
======================================================

SCOPO:
- Definire il modello canonico di un prodotto WebOnDay
- Rappresentare la verità assoluta del dominio Products
- Essere l’unico punto di validazione strutturale e semantica

RESPONSABILITÀ:
- Validare struttura, tipi e vincoli (Zod)
- Garantire coerenza dei dati salvati in KV
- Bloccare dati non validi (prezzi negativi, tipi errati, campi mancanti)

TIMESTAMPS:
- createdAt: data di creazione del prodotto (immutabile)
- updatedAt: data ultimo aggiornamento (sempre aggiornata)
- Entrambi sono PARTE DEL DOMINIO, non metadata tecnici

REGOLE:
- Ogni prodotto valido DEVE avere createdAt e updatedAt
- Nessun campo “fantasma” è ammesso
- Qualsiasi dato non conforme genera errore (fail-fast)

NON DEVE FARE:
- NON normalizzare dati legacy
- NON applicare logica di business
- NON conoscere il frontend

NOTE:
- Ogni modifica a questo schema ha impatto su:
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

  startupFee: z.number().nonnegative().default(0),

  pricing: ProductPricingSchema.default({
    yearly: 0,
    monthly: 0,
  }),

  deliveryTime: z.string().optional().default(""),
  flags: z.array(z.string()).default([]),

  optionIds: z.array(z.string()).default([]),

  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),

  // ✅ TIMESTAMPS DI DOMINIO
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Product = z.infer<typeof ProductSchema>;
