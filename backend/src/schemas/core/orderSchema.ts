// ======================================================
// DOMAIN || OrderSchema — ECONOMIC ACT (v2)
// ======================================================
//
// Order = atto economico immutabile
// NON è carrello
// NON è subscription
// NON è progetto
//
// Ogni pagamento reale genera UN Order
// ======================================================

import { z } from "zod";

/* =========================
   ORDER TYPE
========================= */
export const OrderTypeSchema = z.enum([
  // SaaS
  "SUBSCRIPTION_START",
  "SUBSCRIPTION_RENEWAL",
  "PRODUCT_UPGRADE",

  // Option (add-on)
  "OPTION_ADD",
  "OPTION_REMOVE",

  // Project (one-time a milestone)
  "PROJECT_START",        // milestone 1
  "PROJECT_PROGRESS",     // milestone 2
  "PROJECT_COMPLETE",     // milestone 3
]);

/* =========================
   PAYMENT
========================= */
export const PaymentSchema = z.object({
  provider: z.literal("paypal"),
  providerOrderId: z.string().min(1),
  status: z.enum(["PAID", "FAILED"]),
});

/* =========================
   ORDER (DOMAIN)
========================= */
export const OrderSchema = z.object({
  id: z.string().uuid(),

  type: OrderTypeSchema,

  // soggetto economico
  businessId: z.string().min(1),
  userId: z.string().nullable().optional(),

  // riferimenti dominio
  productId: z.string().optional(),   // SaaS o progetto
  projectId: z.string().optional(),   // SOLO per PROJECT_*
  optionIds: z.array(z.string()).optional(), // per OPTION_ADD

  // importo pagato ORA
  amount: z.number().nonnegative(),

  // rimborsabilità (solo per project)
  refundablePercent: z
    .number()
    .min(0)
    .max(100)
    .optional(),

  payment: PaymentSchema,

  // legale
  policyAccepted: z.literal(true),
  policyVersion: z.string().min(1),

  createdAt: z.string().datetime(),
});

/* =========================
   DOMAIN INVARIANTS
========================= */
export const OrderDomainSchema = OrderSchema.superRefine((order, ctx) => {
  // PROJECT orders devono avere projectId
  if (order.type.startsWith("PROJECT") && !order.projectId) {
    ctx.addIssue({
      path: ["projectId"],
      message: "projectId required for project orders",
      code: z.ZodIssueCode.custom,
    });
  }

  // OPTION_ADD deve avere optionIds
  if (order.type === "OPTION_ADD" && !order.optionIds?.length) {
    ctx.addIssue({
      path: ["optionIds"],
      message: "optionIds required for OPTION_ADD",
      code: z.ZodIssueCode.custom,
    });
  }

  // FAILED non deve esistere come ordine persistente
  if (order.payment.status === "FAILED") {
    ctx.addIssue({
      path: ["payment.status"],
      message: "FAILED orders must not be persisted",
      code: z.ZodIssueCode.custom,
    });
  }
});

export type Order = z.infer<typeof OrderDomainSchema>;
export type OrderType = z.infer<typeof OrderTypeSchema>;
