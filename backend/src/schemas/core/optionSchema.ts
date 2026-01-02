import { z } from "zod";

/**
 * ======================================================
 * OPTION SCHEMA — DOMINIO PURO
 * ======================================================
 *
 * OPTION = regola economica applicabile a un prodotto
 *
 * DEFINISCE:
 * - prezzo
 * - tipo di pagamento (one-time / recurring)
 * - intervallo (se recurring)
 *
 * NON DEFINISCE:
 * - provider (PayPal, Stripe, ecc.)
 * - metodo di pagamento
 *
 * Il provider viene risolto a CHECKOUT.
 * ======================================================
 */

export const PaymentRuleSchema = z.object({
  mode: z.enum(["one_time", "recurring"]),
  interval: z.enum(["monthly", "yearly"]).optional(),
});

export const OptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),

  price: z.number().min(0),

  payment: PaymentRuleSchema,

  status: z.enum(["ACTIVE", "ARCHIVED"]),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type Option = z.infer<typeof OptionSchema>;
