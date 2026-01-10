/**
 * ======================================================
 * CHECKOUT ORDER — DOMAIN SCHEMA (V2)
 * File: backend/src/schemas/orders/checkoutOrderSchema.ts
 * ======================================================
 *
 * RUOLO:
 * - Contenitore centrale del checkout
 * - Nasce SEMPRE da una Solution
 * - Precede pagamento e/o creazione Project
 *
 * È:
 * - auditabile
 * - classificabile (product | project)
 * - utilizzabile per preview FE
 *
 * NON È:
 * - un atto economico finale
 * - un project
 * - una subscription
 *
 * ======================================================
 */

import { z } from "zod";

/* =========================
   ENUM — ORDER KIND
========================= */
/**
 * Serve SOLO per FE / Admin UI.
 * NON influenza logica economica.
 */
export const OrderKindSchema = z.enum([
  "product",
  "project",
]);

export type OrderKind = z.infer<typeof OrderKindSchema>;

/* =========================
   ENUM — ORDER STATUS
========================= */
export const OrderStatusSchema = z.enum([
  "draft",       // configurazione iniziale
  "pending",     // pronto per pagamento
  "confirmed",   // pagato / confermato
  "processed",   // in lavorazione
  "completed",   // concluso
  "deleted",     // cancellato logicamente
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

/* =========================
   PAYMENT (CHECKOUT)
========================= */
/**
 * ATTENZIONE:
 * - Qui NON è ancora EconomicOrder
 * - Serve solo per tracciare il pagamento
 */
export const PaymentSchema = z.object({
  provider: z.literal("paypal"),
  providerOrderId: z.string().min(1),
  status: z.enum(["PAID", "FAILED"]),
});

/* =========================
   BUSINESS SNAPSHOT
========================= */
/**
 * Snapshot IMMUTABILE usato per:
 * - preview FE
 * - storico Admin
 *
 * NON è source of truth.
 */
export const BusinessSnapshotSchema = z.object({
  name: z.string().min(1),
  city: z.string().optional(),
  sector: z.string().optional(),
});

/* =========================
   CHECKOUT ORDER
========================= */
export const CheckoutOrderSchema = z.object({
  /* ---------- Identità ---------- */
  id: z.string().uuid(),
  status: OrderStatusSchema,
  orderKind: OrderKindSchema,

  /* ---------- Origine ---------- */
  solutionId: z.string().min(1),

  /**
   * Product acquistati (SaaS / one-shot)
   * - presente se orderKind = product
   */
  productIds: z.array(z.string()).optional(),

  /**
   * Project generato post-checkout
   * - presente se orderKind = project
   */
  projectId: z.string().optional(),

  /**
   * Option selezionate (future o attive)
   */
  optionIds: z.array(z.string()).optional(),

  /* ---------- Business ---------- */
  businessId: z.string().min(1),

  businessSnapshot: BusinessSnapshotSchema,

  /* ---------- Economico ---------- */
  total: z.number().nonnegative().optional(),
  currency: z.literal("EUR"),

  /* ---------- Pagamento ---------- */
  payment: PaymentSchema.optional(),

  /* ---------- Audit ---------- */
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

/* =========================
   DOMAIN INVARIANTS
========================= */
export const CheckoutOrderDomainSchema =
  CheckoutOrderSchema.superRefine((order, ctx) => {

    // project order → projectId obbligatorio
    if (order.orderKind === "project" && !order.projectId) {
      ctx.addIssue({
        path: ["projectId"],
        message: "projectId required for project orders",
        code: z.ZodIssueCode.custom,
      });
    }

    // product order → almeno un product
    if (
      order.orderKind === "product" &&
      (!order.productIds || order.productIds.length === 0)
    ) {
      ctx.addIssue({
        path: ["productIds"],
        message: "productIds required for product orders",
        code: z.ZodIssueCode.custom,
      });
    }

    // FAILED non deve essere persistito
    if (order.payment?.status === "FAILED") {
      ctx.addIssue({
        path: ["payment.status"],
        message: "FAILED checkout orders must not be persisted",
        code: z.ZodIssueCode.custom,
      });
    }
  });
/* ======================================================
   CHECKOUT ORDER — STATE MACHINE
   ====================================================== */

 /* ======================================================
   CHECKOUT ORDER — STATE MACHINE
====================================================== */

export const CheckoutOrderTransitions: Record<
OrderStatus,
readonly OrderStatus[]
> = {
draft: ["pending", "deleted"],
pending: ["confirmed", "deleted"],
confirmed: ["processed", "deleted"],
processed: ["completed"],
completed: [],
deleted: [],
};

/**
* Verifica se una transizione di stato è lecita.
*
* @throws Error("INVALID_ORDER_TRANSITION")
*/
export function assertCheckoutOrderTransition(
from: OrderStatus,
to: OrderStatus
): void {
const allowed = CheckoutOrderTransitions[from];

if (!allowed.includes(to)) {
  throw new Error("INVALID_ORDER_TRANSITION");
}
}

  
export type CheckoutOrder = z.infer<typeof CheckoutOrderDomainSchema>;
