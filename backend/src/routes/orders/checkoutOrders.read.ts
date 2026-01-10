/**
 * ======================================================
 * CHECKOUT ORDERS — READ SIDE (V2)
 * File: backend/src/routes/orders/checkoutOrders.read.ts
 * ======================================================
 *
 * RUOLO:
 * - Read-only access ai CheckoutOrders
 * - Usato da Admin e FE
 *
 * SUPPORTA:
 * - Filtro per status
 * - Filtro per orderKind (product / project)
 *
 * SOURCE OF TRUTH:
 * - CheckoutOrderDomainSchema
 * ======================================================
 */

import type { Env } from "../../types/env";
import { CheckoutOrderDomainSchema } from "../../domains/order/order.checkout.schema";

/* =========================
   JSON helper
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ======================================================
   GET /api/orders
   LIST CHECKOUT ORDERS (FILTERABLE)
====================================================== */
export async function listOrders(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);

  const statusFilter = url.searchParams.get("status"); // draft | deleted | completed
  const kindFilter = url.searchParams.get("orderKind"); // product | project

  const list = await env.ORDER_KV.list({ prefix: "ORDER:" });

  const orders = [];

  for (const key of list.keys) {
    const raw = await env.ORDER_KV.get(key.name);
    if (!raw) continue;

    try {
      const order = CheckoutOrderDomainSchema.parse(JSON.parse(raw));

      if (statusFilter && order.status !== statusFilter) continue;
      if (kindFilter && order.orderKind !== kindFilter) continue;

      orders.push(order);
    } catch (err) {
      console.error("INVALID_CHECKOUT_ORDER:", key.name, err);
    }
  }

  orders.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return json({ ok: true, orders });
}

/* ======================================================
   GET /api/orders/:id
====================================================== */
export async function getOrder(
  request: Request,
  env: Env
): Promise<Response> {
  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return json({ ok: false, error: "MISSING_ID" }, 400);
  }

  const raw = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!raw) {
    return json({ ok: false, error: "NOT_FOUND" }, 404);
  }

  try {
    const order = CheckoutOrderDomainSchema.parse(JSON.parse(raw));
    return json({ ok: true, order });
  } catch (err) {
    console.error("CORRUPTED_CHECKOUT_ORDER:", id, err);
    return json({ ok: false, error: "CORRUPTED_ORDER" }, 500);
  }
}
