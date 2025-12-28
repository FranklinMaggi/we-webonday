// backend/src/schemas/cartSchema.ts
// DOMAIN: CORE (LEGACY CART v1 — da migrare a Cart v2)

import { z } from "zod";

export const CartOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  price: z.number(),
  recurring: z.boolean(),
});

export const CartItemSchema = z.object({
  productId: z.string(),
  title: z.string(),
  basePrice: z.number(),
  options: z.array(CartOptionSchema),
  total: z.number(),
});

export type CartItemDTO = z.infer<typeof CartItemSchema>;
