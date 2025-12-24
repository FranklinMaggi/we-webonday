// backend/src/routes/admin/admin.orders.ts

/**
 * ======================================================
 * ADMIN — ORDERS
 * READ ONLY
 * ======================================================
 *
 * RESPONSABILITÀ:
 * - Listing ordini
 * - Dettaglio ordine
 *
 * NOTE:
 * - Nessuna logica di business
 * - Nessuna transizione di stato
 * - Nessuna scrittura
 *
 * La sicurezza (x-admin-token) è gestita DAL ROUTER.
 */

import type { Env } from "../../types/env";
import { z } from "zod";
import {
  OrderSchema,
  OrderBaseSchema,
} from "../../schemas/core/orderSchema";

/* =========================
   JSON helper locale
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* =========================
   DTO — Admin Summary
   (no paypalCapture)
========================= */
const OrderSummarySchema = OrderBaseSchema.omit({
  paypalCapture: true,
});

type OrderSummaryDTO = z.infer<typeof OrderSummarySchema>;

/* ======================================================
   GET /api/admin/orders
====================================================== */
export async function listAdminOrders(
  _request: Request,
  env: Env
): Promise<Response> {
  const list = await env.ORDER_KV.list({ prefix: "ORDER:" });

  const orders: OrderSummaryDTO[] = [];

  for (const key of list.keys) {
    const raw = await env.ORDER_KV.get(key.name);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      orders.push(OrderSummarySchema.parse(parsed));
    } catch (err) {
      console.error("Invalid order in KV:", key.name, err);
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
   GET /api/admin/orders/:id
====================================================== */
export async function getAdminOrder(
  request: Request,
  env: Env
): Promise<Response> {
  const id = request.url.split("/").pop();

  if (!id) {
    return json({ ok: false, error: "MISSING_ORDER_ID" }, 400);
  }

  const raw = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!raw) {
    return json({ ok: false, error: "ORDER_NOT_FOUND" }, 404);
  }

  try {
    const order = OrderSchema.parse(JSON.parse(raw));
    return json({ ok: true, order });
  } catch (err) {
    console.error("Corrupted order:", id, err);
    return json({ ok: false, error: "CORRUPTED_ORDER" }, 500);
  }
}
