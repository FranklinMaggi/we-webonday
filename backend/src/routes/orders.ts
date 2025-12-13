// backend/src/routes/orders.ts
import type { Env } from "../types/env";


function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json"},
  });
}

// ===========================
// GET /api/orders/list
// ===========================
export async function listOrders(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204});
  }

  const list = await env.ORDER_KV.list({ prefix: "ORDER:" });
  const orders: any[] = [];

  for (const key of list.keys) {
    const stored = await env.ORDER_KV.get(key.name);
    if (stored) orders.push(JSON.parse(stored));
  }

  orders.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return json({ ok: true, orders });
}

// ===========================
// GET /api/order?id=XYZ
// ===========================
export async function getOrder(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return json({ ok: false, error: "Missing id" }, 400);
  }

  const stored = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!stored) {
    return json({ ok: false, error: "Not found" }, 404);
  }

  return json({ ok: true, order: JSON.parse(stored) });
}
