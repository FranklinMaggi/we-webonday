/**
 * ======================================================
 * BE || PAYMENT || PAYPAL — CREATE ORDER
 * File: backend/src/routes/payment/paypal/paypal.create.ts
 * ======================================================
 *
 * RUOLO:
 * - Creare PayPal Order (intent: CAPTURE)
 *
 * INVARIANTI:
 * - Order deve essere PENDING
 * - total deve esistere
 * - NON muta order.status
 */

import type { Env } from "../../../types/env";
import { CheckoutOrderDomainSchema } from "../../../schemas/orders/checkoutOrderSchema";
import { getPaypalAccessToken } from "./paypal.auth";
import { CreatePaypalOrderBody } from "./paypal.types";

/* =========================
   JSON helper locale
========================= */
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
export async function createPaypalOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = CreatePaypalOrderBody.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_INPUT" }, 400);
  }

  const order = await loadOrder(env, body.orderId);
  if (!order) return json({ ok: false, error: "ORDER_NOT_FOUND" }, 404);

  if (order.status !== "pending") {
    return json({ ok: false, error: "ORDER_NOT_PAYABLE" }, 409);
  }

  if (order.total === undefined) {
    return json({ ok: false, error: "MISSING_TOTAL" }, 409);
  }

  // Idempotenza
  if (order.payment?.provider === "paypal") {
    return json({
      ok: true,
      orderId: order.id,
      paypalOrderId: order.payment.providerOrderId,
      idempotent: true,
    });
  }

  const accessToken = await getPaypalAccessToken(env);

  const res = await fetch(`${env.PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: order.id,
        amount: {
          currency_code: order.currency,
          value: order.total.toFixed(2),
        },
      }],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    return json({ ok: false, error: "PAYPAL_CREATE_FAILED", details: txt }, 502);
  }

  const paypalOrder = (await res.json()) as { id: string };

  await persistOrder(env, {
    ...order,
    payment: {
      provider: "paypal",
      providerOrderId: paypalOrder.id,
      status: "CREATED",
    },
    updatedAt: new Date().toISOString(),
  });

  return json({
    ok: true,
    orderId: order.id,
    paypalOrderId: paypalOrder.id,
  });
}
