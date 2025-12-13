// backend/src/routes/order.ts
import type { Env } from "../types/env";
import { OrderSchema } from "../schemas/orderSchema";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export async function createOrder(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  let rawBody: any;
  try {
    rawBody = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const orderId = crypto.randomUUID();

  const orderRaw = {
    id: orderId,
    userId: rawBody.userId ?? null,
    email: rawBody.email,

    firstName: rawBody.firstName ?? null,
    lastName: rawBody.lastName ?? null,
    phone: rawBody.phone ?? null,
    billingAddress: rawBody.billingAddress ?? null,

    piva: rawBody.piva ?? null,
    businessName: rawBody.businessName ?? null,

    items: rawBody.items,
    total: rawBody.total,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };

  let validatedOrder;
  try {
    validatedOrder = OrderSchema.parse(orderRaw);
  } catch (err) {
    console.error("Order validation failed (manual)", err);
    return json({ ok: false, error: "Order validation failed" }, 400);
  }

  await env.ORDER_KV.put(`ORDER:${orderId}`, JSON.stringify(validatedOrder));

  return json({ ok: true, orderId });
}


// ===========================
// GET /api/orders (lista)
// ===========================
export async function listOrders(request: Request, env: Env) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const list = await env.ORDER_KV.list({ prefix: "ORDER:" });

  const orders = [];

  for (const key of list.keys) {
    const stored = await env.ORDER_KV.get(key.name);
    if (stored) orders.push(JSON.parse(stored));
  }

  // Ordina per data discendente
  orders.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return json({ ok: true, orders });
}

// ===========================
// GET /api/order?id=XYZ (singolo ordine)
// ===========================
export async function getOrder(request: Request, env: Env) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) return json({ ok: false, error: "Missing id" }, 400);

  const stored = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!stored) return json({ ok: false, error: "Not found" }, 404);

  return json({ ok: true, order: JSON.parse(stored) });
}
