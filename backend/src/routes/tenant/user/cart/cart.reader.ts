import type { Env } from "../../../../types/env";
import { CartSchema } from "../../../../domains/cart/cart.schema";
import { CART_KEY } from "../../../../domains/cart/cart.keys";
import { getUserIdFromSession } from "../../../../lib/auth/session";

/**
 * READ CART v2
 * - Session-based
 * - Slot unico
 */
export async function readCart(
  request: Request,
  env: Env
) {
  const sessionId = getUserIdFromSession(request);
  if (!sessionId) {
    return {
      sessionId: null,
      item: undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  const raw = await env.CART_KV.get(CART_KEY(sessionId));
  if (!raw) {
    return {
      sessionId,
      item: undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    return CartSchema.parse(JSON.parse(raw));
  } catch (err) {
    console.error("CORRUPTED_CART:", sessionId, err);
    throw new Error("CORRUPTED_CART");
  }
}
