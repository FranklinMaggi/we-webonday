import type { Env } from "../types/env";
import { OrderSchema } from "../schemas/orderSchema";
import { z } from "zod";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Admin summary (no paypalCapture)
 */
const OrderSummarySchema = OrderSchema.omit({
  paypalCapture: true,
});

type OrderSummaryDTO = z.infer<typeof OrderSummarySchema>;

// ===========================
// GET /api/orders/list (ADMIN)
// ===========================
export async function listOrders(
  _request: Request,
  env: Env
): Promise<Response> {
  const list = await env.ORDER_KV.list({ prefix: "ORDER:" });

  const orders: OrderSummaryDTO[] = [];

  for (const key of list.keys) {
    const stored = await env.ORDER_KV.get(key.name);
    if (!stored) continue;

    try {
      const parsed = JSON.parse(stored);
      const validated = OrderSummarySchema.parse(parsed);
      orders.push(validated);
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

// ===========================
// GET /api/order?id=XYZ (ADMIN)
// ===========================
export async function getOrder(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return json({ ok: false, error: "Missing id" }, 400);
  }

  const stored = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!stored) {
    return json({ ok: false, error: "Not found" }, 404);
  }

  try {
    const parsed = JSON.parse(stored);
    const validated = OrderSchema.parse(parsed);
    return json({ ok: true, order: validated });
  } catch (err) {
    console.error("Order validation failed:", id, err);
    return json({ ok: false, error: "Corrupted order data" }, 500);
  }
}
