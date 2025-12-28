//BE.core.orderSchema.ts
// DOMAIN: CORE (LEGACY CART v1 — da migrare a Cart v2)

import { z } from "zod";
import { CartItemSchema } from "./cartSchema";

export const OrderStatusSchema = z.enum([
  "draft",
  "pending",
  "confirmed",
  "processed",
  "completed",
  "suspended",
  "deleted",
]);

export const PaymentStatusSchema = z.enum([
  "pending",
  "paid",
]);

/* ============================
   BASE OBJECT (NO LOGIC)
============================ */
export const OrderBaseSchema = z.object({
  id: z.string().uuid(),

  userId: z.string().nullable(),

  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  billingAddress: z.string().nullable().optional(),

  piva: z.string().nullable().optional(),
  businessName: z.string().nullable().optional(),

  policyVersion: z.string().min(1),

  items: z.array(CartItemSchema),
  total: z.number().nonnegative(),

  status: OrderStatusSchema,
  createdAt: z.string(),
  cancelReason: z.enum([
    "user",
    "payment_failed",
    "admin",
  ]).optional(),
  
  paymentProvider: z.literal("paypal").optional(),
  paymentStatus: PaymentStatusSchema.optional(),
  paypalOrderId: z.string().optional(),
  paypalCapture: z.unknown().optional(),
});

/* ============================
   DOMAIN INVARIANTS
============================ */
export const OrderSchema = OrderBaseSchema.superRefine((order, ctx) => {
  if (order.paymentStatus && !order.paymentProvider) {
    ctx.addIssue({
      path: ["paymentProvider"],
      message: "paymentProvider required when paymentStatus is set",
      code: z.ZodIssueCode.custom,
    });
  }

  if (order.paymentStatus === "paid" && order.status !== "confirmed") {
    ctx.addIssue({
      path: ["status"],
      message: "paid order must be confirmed",
      code: z.ZodIssueCode.custom,
    });
  }

  if (order.paymentProvider === "paypal" && !order.paypalOrderId) {
    ctx.addIssue({
      path: ["paypalOrderId"],
      message: "paypalOrderId required for PayPal orders",
      code: z.ZodIssueCode.custom,
    });
  }
});

export type OrderDTO = z.infer<typeof OrderSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
