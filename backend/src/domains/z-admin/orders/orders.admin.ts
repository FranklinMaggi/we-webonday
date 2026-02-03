/**
 * ======================================================
 * BE || ADMIN || CHECKOUT ORDERS — READ SIDE (V2)
 * ======================================================
 *
 * AI-SUPERCOMMENT — RESPONSABILITÀ
 *
 * RUOLO:
 * - Espone la READ SIDE ADMIN dei CheckoutOrders
 * - Listing e dettaglio ordini
 *
 * INVARIANTI:
 * - Nessuna scrittura
 * - Nessuna logica di stato
 * - Ordini corrotti NON bloccano la risposta
 *
 * SOURCE OF TRUTH:
 * - CheckoutOrderDomainSchema
 *
 * KV:
 * - ORDER_KV → ORDER:{orderId}
 * ======================================================
 */

import type { Env } from "../../../types/env";
import { z } from "zod";
import {
  CheckoutOrderDomainSchema,
  CheckoutOrderSchema
} from "../../order/order.checkout.schema";

/* =========================
   JSON helper
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* =========================
   DTO — ADMIN SUMMARY
========================= */
const AdminOrderSummarySchema =
  CheckoutOrderSchema.omit({
    payment: true, // opzionale: se esiste davvero
  });

type AdminOrderSummaryDTO =
  z.infer<typeof AdminOrderSummarySchema>;

/* ======================================================
   GET /api/admin/orders
====================================================== */
export async function listAdminOrders(
  _request: Request,
  env: Env
): Promise<Response> {
  const list = await env.ORDER_KV.list({ prefix: "ORDER:" });

  const orders: AdminOrderSummaryDTO[] = [];

  for (const key of list.keys) {
    const raw = await env.ORDER_KV.get(key.name);
    if (!raw) continue;

    try {
      orders.push(
        AdminOrderSummarySchema.parse(JSON.parse(raw))
      );
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
   GET /api/admin/orders/:id
====================================================== */
export async function getAdminOrder(
  request: Request,
  env: Env
): Promise<Response> {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return json({ ok: false, error: "MISSING_ORDER_ID" }, 400);
  }

  const raw = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!raw) {
    return json({ ok: false, error: "ORDER_NOT_FOUND" }, 404);
  }

  try {
    const order =
      CheckoutOrderDomainSchema.parse(JSON.parse(raw));
    return json({ ok: true, order });
  } catch (err) {
    console.error("CORRUPTED_CHECKOUT_ORDER:", id, err);
    return json({ ok: false, error: "CORRUPTED_ORDER" }, 500);
  }
}
