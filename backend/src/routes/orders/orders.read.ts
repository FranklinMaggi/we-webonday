// routes/orders/orders.read.ts

/**
 * ORDERS — READ SIDE
 *
 * - listOrders (admin)
 * - getOrder (detail)
 */

import type { Env } from "../../types/env";
import { z } from "zod";
import { OrderSchema, OrderBaseSchema } from "../../schemas/core/orderSchema";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const OrderSummarySchema = OrderBaseSchema.omit({
  paypalCapture: true,
});

type OrderSummaryDTO = z.infer<typeof OrderSummarySchema>;

export async function listOrders(
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
    } catch {
      console.error("Invalid order:", key.name);
    }
  }

  orders.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return json({ ok: true, orders });
}

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
    return json({ ok: true, order: OrderSchema.parse(JSON.parse(raw)) });
  } catch {
    return json({ ok: false, error: "CORRUPTED_ORDER" }, 500);
  }
}
