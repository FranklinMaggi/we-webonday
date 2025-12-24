//paymentPaypal.ts
import type { Env } from "../../types/env";
import { OrderSchema } from "../../schemas/core/orderSchema";
import { z } from "zod";
import { assertTransition } from "../orders/orders.core";

const CreatePaypalOrderBody = z.object({ orderId: z.string().uuid() });
const CapturePaypalOrderBody = z.object({ orderId: z.string().uuid() });

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

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

  if (!res.ok) throw new Error("PayPal auth failed");
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function loadOrder(env: Env, orderId: string) {
  const raw = await env.ORDER_KV.get(`ORDER:${orderId}`);
  if (!raw) return null;
  return OrderSchema.parse(JSON.parse(raw));
}

async function saveOrder(env: Env, order: any) {
  // validazione schema come ultima linea di difesa
  const validated = OrderSchema.parse(order);
  await env.ORDER_KV.put(`ORDER:${validated.id}`, JSON.stringify(validated));
  return validated;
}

/* =================================================
   POST /api/payment/paypal/create-order
================================================= */
export async function createPaypalOrder(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });

  let body: z.infer<typeof CreatePaypalOrderBody>;
  try {
    body = CreatePaypalOrderBody.parse(await request.json());
  } catch {
    return json({ ok: false, error: "Invalid input" }, 400);
  }

  const order = await loadOrder(env, body.orderId);
  if (!order) return json({ ok: false, error: "Order not found" }, 404);

  // Guardrail status ordine
  if (order.status === "cancelled") {
    return json({ ok: false, error: "ORDER_CANCELLED" }, 409);
  }
  if (order.paymentStatus === "paid" || order.status === "confirmed") {
    return json({ ok: true, orderId: order.id, alreadyPaid: true }, 200);
  }

  // Idempotenza: se già esiste paypalOrderId, non ricreare
  if (order.paypalOrderId) {
    return json({
      ok: true,
      orderId: order.id,
      paypalOrderId: order.paypalOrderId,
      idempotent: true,
    });
  }

  // Crea PayPal order
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
          amount: { currency_code: "EUR", value: order.total.toFixed(2) },
        },
      ],
    }),
  });

  if (!paypalRes.ok) {
    const txt = await paypalRes.text();
    return json({ ok: false, error: "PayPal create error", details: txt }, 502);
  }

  const paypalOrder = (await paypalRes.json()) as { id: string };

  // Persist metadata (NON cambiare status qui: resta pending)
  await saveOrder(env, {
    ...order,
    paymentProvider: "paypal",
    paymentStatus: "pending",
    paypalOrderId: paypalOrder.id,
  });

  return json({ ok: true, orderId: order.id, paypalOrderId: paypalOrder.id });
}

/* =================================================
   POST /api/payment/paypal/capture-order
================================================= */
export async function capturePaypalOrder(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });

  let body: z.infer<typeof CapturePaypalOrderBody>;
  try {
    body = CapturePaypalOrderBody.parse(await request.json());
  } catch {
    return json({ ok: false, error: "Invalid input" }, 400);
  }

  const order = await loadOrder(env, body.orderId);
  if (!order) return json({ ok: false, error: "Order not found" }, 404);

  // Idempotenza capture: se già pagato, stop.
  if (order.paymentStatus === "paid") {
    return json({ ok: true, alreadyCaptured: true, status: order.status });
  }

  // Non catturare ordini cancellati
  if (order.status === "cancelled") {
    return json({ ok: false, error: "ORDER_CANCELLED" }, 409);
  }

  // Deve esistere paypalOrderId
  if (!order.paypalOrderId) {
    return json({ ok: false, error: "Missing paypalOrderId" }, 409);
  }

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
    // NON cambiare ordine in KV, rimane pending/pending
    return json({ ok: false, error: "PayPal capture error", details: txt }, 502);
  }

  const capture = await capRes.json();

  // Transizione dominio: pending -> confirmed
  assertTransition(order.status, "confirmed");

  await saveOrder(env, {
    ...order,
    status: "confirmed",
    paymentStatus: "paid",
    paypalCapture: capture,
  });

  return json({ ok: true, orderId: order.id, status: "confirmed", paymentStatus: "paid" });
}
