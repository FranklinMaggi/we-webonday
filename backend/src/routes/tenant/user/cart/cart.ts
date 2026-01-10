/* ============================================================
   LEGACY CART v1 — VISITOR BASED
============================================================

⚠️ QUESTO NON È IL CART DEFINITIVO

- Usa prezzi già risolti
- Usa visitorId
- Calcola total nel backend
- Serve SOLO come supporto temporaneo

IL CART v2:
- sarà basato su Configuration
- NON conterrà prezzi
- NON conterrà total
- NON userà visitorId

Questo file verrà rimosso.
============================================================ */

// backend/src/routes/cart.ts
import type { Env } from "../../../../types/env";
import { z } from "zod";
import { CartItemSchema } from "../../../../domains/schemas/legacy/cart.v1.schema";

/* ============================================================
   CART DOMAIN — visitorId based (v46)
============================================================ */

const CartSchema = z.object({
  visitorId: z.string(),
  items: z.array(CartItemSchema),
  total: z.number(),
  updatedAt: z.string(),
});

type CartDTO = z.infer<typeof CartSchema>;

/* ============================================================
   SAVE CART
   POST /api/cart
============================================================ */
export async function saveCart(request: Request, env: Env) {
  let raw: any;

  try {
    raw = await request.json();
  } catch {
    throw new Error("Invalid JSON body");
  }

  if (!raw.visitorId) {
    throw new Error("Missing visitorId");
  }

  const items = z.array(CartItemSchema).parse(raw.items);

  // 🔒 total calcolato dal backend
  const total = items.reduce(
    (sum, i) =>
      sum +
      i.basePrice +
      i.options.reduce((s, o) => s + o.price, 0),
    0
  );

  const cart: CartDTO = CartSchema.parse({
    visitorId: raw.visitorId,
    items,
    total,
    updatedAt: new Date().toISOString(),
  });

  await env.CART_KV.put(
    `CART:${cart.visitorId}`,
    JSON.stringify(cart)
  );

  return cart;
}

/* ============================================================
   GET CART
   GET /api/cart?visitorId=XXX
============================================================ */
export async function getCart(request: Request, env: Env) {
  const visitorId = new URL(request.url).searchParams.get("visitorId");
  if (!visitorId) {
    throw new Error("Missing visitorId");
  }

  const raw = await env.CART_KV.get(`CART:${visitorId}`);
  if (!raw) {
    return {
      visitorId,
      items: [],
      total: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  return CartSchema.parse(JSON.parse(raw));
}
