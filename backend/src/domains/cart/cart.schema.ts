/**
 * ======================================================
 * CART DOMAIN — POINTER ONLY
 * ======================================================
 *
 * - Il cart contiene SOLO configurationId
 * - Nessun productId
 * - Nessun prezzo
 * - Nessuna logica commerciale
 *
 * Source of truth:
 * - Configuration
 * - Checkout
 */
// backend/src/domains/cart/cart.schema.ts
import { z } from "zod";

/* =========================
   CART ITEM (INTENTO)
========================= */
export const CartItemSchema = z.object({
configurationId: z.string().min(1), // solo se già creata
});

/* =========================
   CART (SESSION-BASED)
========================= */
export const CartSchema = z.object({
  sessionId: z.string(),
  item: CartItemSchema.optional(),
  updatedAt: z.string().datetime(),
 
});

export type Cart = z.infer<typeof CartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
