/**
 * ======================================================
 * BE || PAYMENT || PAYPAL — CAPTURE
 * File: backend/src/routes/payment/paypal/paypal.capture.ts
 * ======================================================
 *
 * RUOLO:
 * - Cattura pagamento PayPal
 *
 * INVARIANTI:
 * - Order deve essere PENDING
 * - payment.providerOrderId deve esistere
 * - NON muta order.status
 */

import type { Env } from "../../../types/env";
import { CheckoutOrderDomainSchema } from "../../../domains/order/order.checkout.schema";
import { getPaypalAccessToken } from "./paypal.auth";
import { CapturePaypalOrderBody } from "./paypal.types";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function loadOrder(env: Env, orderId: string) {
  const raw = await env.ORDER_KV.get(`ORDER:${orderId}`);
  if (!raw) return null;
  return CheckoutOrderDomainSchema.parse(JSON.parse(raw));
}

async function persistOrder(env: Env, order: unknown) {
  const validated = CheckoutOrderDomainSchema.parse(order);
  await env.ORDER_KV.put(`ORDER:${validated.id}`, JSON.stringify(validated));
  return validated;
}

/* ======================================================
   HANDLER
====================================================== */
export async function capturePaypalOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = CapturePaypalOrderBody.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_INPUT" }, 400);
  }

  const order = await loadOrder(env, body.orderId);
  if (!order) return json({ ok: false, error: "ORDER_NOT_FOUND" }, 404);

  if (order.status !== "pending") {
    return json({ ok: false, error: "ORDER_NOT_PAYABLE" }, 409);
  }

  if (!order.payment?.providerOrderId) {
    return json({ ok: false, error: "MISSING_PAYPAL_ORDER" }, 409);
  }

  if (order.payment.status === "PAID") {
    return json({
      ok: true,
      orderId: order.id,
      paymentStatus: "PAID",
      idempotent: true,
    });
  }

  const accessToken = await getPaypalAccessToken(env);

  const res = await fetch(
    `${env.PAYPAL_API_BASE}/v2/checkout/orders/${order.payment.providerOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const txt = await res.text();
    return json({ ok: false, error: "PAYPAL_CAPTURE_FAILED", details: txt }, 502);
  }

  await persistOrder(env, {
    ...order,
    payment: {
      provider: "paypal",
      providerOrderId: order.payment.providerOrderId,
      status: "PAID",
    },
    updatedAt: new Date().toISOString(),
  });

  return json({
    ok: true,
    orderId: order.id,
    paymentStatus: "PAID",
  });
}
