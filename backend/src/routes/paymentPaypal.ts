// backend/src/routes/paymentPaypal.ts
import type { Env } from "../types/env";
import { OrderSchema } from "../schemas/orderSchema";
import { z } from "zod";

/* ============================
   SCHEMAS
============================ */
const CreatePaypalOrderBody = z.object({
  orderId: z.string().uuid(),
});

const CapturePaypalOrderBody = z.object({
  orderId: z.string().uuid(),
});

/* ============================
   JSON HELPER
============================ */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ============================
   PAYPAL ACCESS TOKEN
============================ */
async function getPaypalAccessToken(env: Env): Promise<string> {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_SECRET || !env.PAYPAL_API_BASE) {
    throw new Error("Missing PayPal configuration");
  }

  const creds = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);

  const res = await fetch(`${env.PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("PayPal auth failed");
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/* =================================================
   POST /api/payment/paypal/create-order
================================================= */
export async function createPaypalOrder(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  // 1) validate input
  let body: z.infer<typeof CreatePaypalOrderBody>;
  try {
    body = CreatePaypalOrderBody.parse(await request.json());
  } catch {
    return json({ ok: false, error: "Invalid input" }, 400);
  }

  // 2) load order
  const raw = await env.ORDER_KV.get(`ORDER:${body.orderId}`);
  if (!raw) {
    return json({ ok: false, error: "Order not found" }, 404);
  }

  let order;
  try {
    order = OrderSchema.parse(JSON.parse(raw));
  } catch {
    return json({ ok: false, error: "Corrupted order data" }, 500);
  }

  // 3) idempotency
  if (order.paypalOrderId) {
    return json({
      ok: true,
      orderId: order.id,
      paypalOrderId: order.paypalOrderId,
    });
  }

  // 4) create PayPal order using backend-calculated total
  const accessToken = await getPaypalAccessToken(env);

  const paypalRes = await fetch(`${env.PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          amount: {
            currency_code: "EUR",
            value: order.total.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!paypalRes.ok) {
    const txt = await paypalRes.text();
    return json({ ok: false, error: "PayPal create error", details: txt }, 500);
  }

  const paypalOrder = (await paypalRes.json()) as { id: string };

  // 5) persist PayPal metadata
  await env.ORDER_KV.put(
    `ORDER:${order.id}`,
    JSON.stringify({
      ...order,
      paymentProvider: "paypal",
      paymentStatus: "pending",
      paypalOrderId: paypalOrder.id,
    })
  );

  return json({
    ok: true,
    orderId: order.id,
    paypalOrderId: paypalOrder.id,
  });
}

/* =================================================
   POST /api/payment/paypal/capture-order
================================================= */
export async function capturePaypalOrder(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  // 1) validate input
  let body: z.infer<typeof CapturePaypalOrderBody>;
  try {
    body = CapturePaypalOrderBody.parse(await request.json());
  } catch {
    return json({ ok: false, error: "Invalid input" }, 400);
  }

  // 2) load order
  const raw = await env.ORDER_KV.get(`ORDER:${body.orderId}`);
  if (!raw) {
    return json({ ok: false, error: "Order not found" }, 404);
  }

  let order;
  try {
    order = OrderSchema.parse(JSON.parse(raw));
  } catch {
    return json({ ok: false, error: "Corrupted order data" }, 500);
  }

  // 3) idempotency
  if (order.paymentStatus === "paid") {
    return json({ ok: true, alreadyCaptured: true });
  }

  if (!order.paypalOrderId) {
    return json({ ok: false, error: "Missing paypalOrderId" }, 409);
  }

  // 4) capture
  const accessToken = await getPaypalAccessToken(env);

  const capRes = await fetch(
    `${env.PAYPAL_API_BASE}/v2/checkout/orders/${order.paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    }
  );

  if (!capRes.ok) {
    const txt = await capRes.text();
    return json(
      { ok: false, error: "PayPal capture error", details: txt },
      500
    );
  }

  const capture = await capRes.json();

  // 5) persist capture
  await env.ORDER_KV.put(
    `ORDER:${order.id}`,
    JSON.stringify({
      ...order,
      paymentStatus: "paid",
      paypalCapture: capture,
    })
  );

  return json({ ok: true });
}
