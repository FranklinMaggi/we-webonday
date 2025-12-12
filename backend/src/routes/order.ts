import type { Env } from "../types/env";
import { OrderSchema } from "../schemas/orderSchema";
import { logActivity } from "../lib/logActivity";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS }
  });
}

export async function createOrder(request: Request, env: Env) {
  let rawBody: any;

  try {
    rawBody = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const orderId = crypto.randomUUID();

  const orderRaw = {
    id: orderId,
    userId: rawBody.userId ?? null,
    email: rawBody.email,
    piva: rawBody.piva ?? null,
    businessName: rawBody.businessName ?? null,
    items: rawBody.items,
    total: rawBody.total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  let validatedOrder;
  try {
    validatedOrder = OrderSchema.parse(orderRaw);
  } catch (err) {
    return json({ error: "Order validation failed", details: err }, 400);
  }

  await env.ORDER_KV.put(`ORDER:${orderId}`, JSON.stringify(validatedOrder));

  await logActivity(env, "ORDER_CREATED", validatedOrder.userId, {
    orderId,
    total: validatedOrder.total,
    itemCount: validatedOrder.items.length,
  });
  
  // In futuro: log attività, invio email, ecc.
  
  return json({ ok: true, orderId });
}
