// backend/src/domains/cart/cart.schema.ts
import { z } from "zod";

/* =========================
   CART ITEM (INTENTO)
========================= */
export const CartItemSchema = z.object({
  productId: z.string(),
  configurationRequired: z.boolean(),
  configurationId: z.string().optional(), // solo se già creata
});

/* =========================
   CART (SESSION-BASED)
========================= */
export const CartSchema = z.object({
  sessionId: z.string(),
  item: CartItemSchema.optional(),
  updatedAt: z.string().datetime(),
  quantity: z.literal(1), 
});

export type Cart = z.infer<typeof CartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
