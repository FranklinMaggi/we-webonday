import type { Env } from "../../../../types/env";
import { json } from "../../../..//lib/https";
import { readCart } from "./cart.reader";
import { writeCart, clearCart } from "./cart.writer";

/* ======================================================
   GET /api/cart/v2
====================================================== */
export async function getCart(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const cart = await readCart(request, env);
    return json({ ok: true, cart }, request, env);
  } catch (err) {
    return json(
      { ok: false, error: "CART_READ_FAILED" },
      request,
      env,
      500
    );
  }
}

/* ======================================================
   PUT /api/cart/v2
====================================================== */
export async function putCart(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const cart = await writeCart(request, env);
    return json({ ok: true, cart }, request, env);
  } catch (err: any) {
    return json(
      { ok: false, error: err.message ?? "CART_WRITE_FAILED" },
      request,
      env,
      400
    );
  }
}

/* ======================================================
   DELETE /api/cart/v2
====================================================== */
export async function deleteCart(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const cart = await clearCart(request, env);
    return json({ ok: true, cart }, request, env);
  } catch (err: any) {
    return json(
      { ok: false, error: err.message ?? "CART_CLEAR_FAILED" },
      request,
      env,
      400
    );
  }
}
