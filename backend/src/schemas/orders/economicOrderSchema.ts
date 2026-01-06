
/**
 * ======================================================
 * ECONOMIC ORDER — DOMAIN SCHEMA (V2)
 * ======================================================
 *
 * COSA RAPPRESENTA:
 * - Atto economico FINALE
 * - Creato SOLO dopo pagamento riuscito
 *
 * INVARIANTI:
 * - IMMUTABILE
 * - SEMPRE pagato
 * - NESSUNO stato
 * - NESSUN draft
 *
 * ======================================================
 */

import { z } from "zod";

export const EconomicOrderSchema = z.object({
  id: z.string().uuid(),

  type: z.enum([
    "PROJECT_START",
    "PROJECT_PROGRESS",
    "PROJECT_COMPLETE",
    "OPTION_ADD",
    "OPTION_REMOVE",
  ]),

  businessId: z.string().min(1),
  projectId: z.string().optional(),
  productId: z.string().optional(),
  optionIds: z.array(z.string()).optional(),

  amount: z.number().nonnegative(),

  refundablePercent: z.number().min(0).max(100).optional(),

  payment: z.object({
    provider: z.literal("paypal"),
    providerOrderId: z.string().min(1),
    status: z.literal("PAID"),
  }),

  policyAccepted: z.literal(true),
  policyVersion: z.string().min(1),

  createdAt: z.string().datetime(),
});

export type EconomicOrder = z.infer<typeof EconomicOrderSchema>;
