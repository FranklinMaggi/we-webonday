// backend/src/schemas/orderSchema.ts
import { z } from "zod";
import { CartItemSchema } from "./cartSchema";

export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().nullable(),          // null se guest (anche se noi usiamo Google)

  // DATI CONTATTO / FATTURAZIONE
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  billingAddress: z.string().nullable().optional(),

  piva: z.string().nullable().optional(),
  businessName: z.string().nullable().optional(),

  // CARRELLO
  items: z.array(CartItemSchema),
  total: z.number(),

  // META STATO
  status: z.enum(["pending", "confirmed", "cancelled"]),
  createdAt: z.string(), // ISO

  // OPZIONALE: INFO PAGAMENTO
  paymentProvider: z.string().optional(),   // "paypal", "manual", ecc.
  paymentStatus: z.string().optional(),    // "pending", "paid", ...
  paypalOrderId: z.string().optional(),
  paypalCapture: z.unknown().optional(),
});

export type OrderDTO = z.infer<typeof OrderSchema>;
