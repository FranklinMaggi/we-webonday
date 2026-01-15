import type { Env } from "../../../../types/env";
import { CartSchema, CartItemSchema } from "../../../../domains/cart/cart.schema";
import { CART_KEY } from "../../../../domains/cart/cart.keys";
import { getUserIdFromSession } from "@domains/auth";

/**
 * SET / REPLACE CART ITEM
 * - Sostituisce sempre lo slot
 */
export async function writeCart(
  request: Request,
  env: Env
) {
  const sessionId = getUserIdFromSession(request);
  if (!sessionId) {
    throw new Error("MISSING_SESSION");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new Error("INVALID_JSON");
  }

  // 🔒 quantity = 1 enforced by schema
  const item = CartItemSchema.parse(body);

  const cart = CartSchema.parse({
    sessionId,
    item,
    updatedAt: new Date().toISOString(),
  });

  await env.CART_KV.put(
    CART_KEY(sessionId),
    JSON.stringify(cart)
  );

  return cart;
}

/**
 * CLEAR CART
 */
export async function clearCart(
  request: Request,
  env: Env
) {
  const sessionId = getUserIdFromSession(request);
  if (!sessionId) {
    throw new Error("MISSING_SESSION");
  }

  await env.CART_KV.delete(CART_KEY(sessionId));

  return {
    sessionId,
    item: undefined,
    updatedAt: new Date().toISOString(),
  };
}
