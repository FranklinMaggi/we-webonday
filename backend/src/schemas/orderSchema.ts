// backend/src/schemas/orderSchema.ts
import { z } from "zod";
import { CartItemSchema } from "./cartSchema";

export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().nullable(),  // null se guest
  email: z.string().email(),
  piva: z.string().optional(),
  businessName: z.string().optional(),

  items: z.array(CartItemSchema),
  total: z.number(),

  status: z.enum(["pending", "confirmed", "cancelled"]),
  createdAt: z.string(),          // ISO
});

export type OrderDTO = z.infer<typeof OrderSchema>;
