// backend/src/routes/order.ts
import type { Env } from "../types/env";
import { OrderSchema } from "../schemas/orderSchema";
import { logActivity } from "../lib/logActivity";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json"},
  });
}

export async function createOrder(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204});
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
    console.error("Order validation failed", err);
    return json(
      { ok: false, error: "Order validation failed" },
      400
    );
  }

  await env.ORDER_KV.put(
    `ORDER:${orderId}`,
    JSON.stringify(validatedOrder)
  );

  await logActivity(env, "ORDER_CREATED", validatedOrder.userId, {
    orderId,
    total: validatedOrder.total,
    itemCount: validatedOrder.items.length,
  });

  return json({ ok: true, orderId });
}
