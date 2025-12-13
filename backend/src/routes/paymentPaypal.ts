// backend/src/routes/paymentPaypal.ts
import type { Env } from "../types/env";
import { OrderSchema } from "../schemas/orderSchema";
import type { CartItemDTO } from "../schemas/cartSchema";

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

// ==========================
// Helper: PayPal Access Token
// ==========================
async function getPaypalAccessToken(env: Env): Promise<string> {
  console.log("PayPal env check", {
    clientIdPresent: !!env.PAYPAL_CLIENT_ID,
    secretPresent: !!env.PAYPAL_SECRET,
    apiBase: env.PAYPAL_API_BASE,
  });

  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_SECRET || !env.PAYPAL_API_BASE) {
    console.error("Missing PayPal configuration", {
      clientIdPresent: !!env.PAYPAL_CLIENT_ID,
      secretPresent: !!env.PAYPAL_SECRET,
      apiBase: env.PAYPAL_API_BASE,
    });
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
    const txt = await res.text();
    console.error("PayPal token error:", txt);
    throw new Error("PayPal auth failed");
  }

  const jsonData = (await res.json()) as { access_token: string };
  return jsonData.access_token;
}

// =================================================
// POST /api/payment/paypal/create-order
// =================================================
export async function createPaypalOrder(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const body = (await request.json()) as {
    userId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    billingAddress?: string;
    piva?: string;
    businessName?: string;
    items?: CartItemDTO[];
    total?: number;
  };

  if (!body.email || !Array.isArray(body.items) || typeof body.total !== "number") {
    return json({ ok: false, error: "Missing fields" }, 400);
  }

  const orderId = crypto.randomUUID();

  const orderRaw = {
    id: orderId,
    userId: body.userId ?? null,
    email: body.email,

    firstName: body.firstName ?? null,
    lastName: body.lastName ?? null,
    phone: body.phone ?? null,
    billingAddress: body.billingAddress ?? null,

    piva: body.piva ?? null,
    businessName: body.businessName ?? null,

    items: body.items,
    total: body.total,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };

  let order;
  try {
    order = OrderSchema.parse(orderRaw);
  } catch (err) {
    console.error("Order validation failed (paypal)", err);
    return json({ ok: false, error: "Order validation failed" }, 400);
  }

  await env.ORDER_KV.put(`ORDER:${orderId}`, JSON.stringify(order));

  // === crea ordine su PayPal ===
  let accessToken: string;
  try {
    accessToken = await getPaypalAccessToken(env);
  } catch (err) {
    console.error("PayPal auth error", err);
    return json({ ok: false, error: "PayPal auth error" }, 500);
  }

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
          reference_id: orderId,
          amount: {
            currency_code: "EUR",
            value: body.total.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!paypalRes.ok) {
    const txt = await paypalRes.text();
    console.error("PayPal create order error:", txt);
    return json({ ok: false, error: "PayPal create error", details: txt }, 500);
  }

  const paypalOrder = (await paypalRes.json()) as { id: string };

  await env.ORDER_KV.put(
    `ORDER:${orderId}`,
    JSON.stringify({
      ...order,
      paymentProvider: "paypal",
      paymentStatus: "pending",
      paypalOrderId: paypalOrder.id,
    })
  );

  return json({
    ok: true,
    orderId,
    paypalOrderId: paypalOrder.id,
  });
}

// =================================================
// POST /api/payment/paypal/capture-order
// =================================================
export async function capturePaypalOrder(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const body = (await request.json()) as {
    paypalOrderId?: string;
    orderId?: string;
  };

  if (!body.paypalOrderId || !body.orderId) {
    return json({ ok: false, error: "Missing ids" }, 400);
  }

  const raw = await env.ORDER_KV.get(`ORDER:${body.orderId}`);
  if (!raw) {
    return json({ ok: false, error: "Order not found" }, 404);
  }

  const order = JSON.parse(raw);

  let accessToken: string;
  try {
    accessToken = await getPaypalAccessToken(env);
  } catch (err) {
    console.error("PayPal auth error (capture)", err);
    return json({ ok: false, error: "PayPal auth error" }, 500);
  }

  const capRes = await fetch(
    `${env.PAYPAL_API_BASE}/v2/checkout/orders/${body.paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: "{}", // body vuoto
    }
  );

  if (!capRes.ok) {
    const txt = await capRes.text();
    console.error("PayPal capture error:", txt);
    return json(
      { ok: false, error: "PayPal capture error", details: txt },
      500
    );
  }

  const capture = await capRes.json();

  await env.ORDER_KV.put(
    `ORDER:${body.orderId}`,
    JSON.stringify({
      ...order,
      paymentStatus: "paid",
      paypalCapture: capture,
    })
  );

  return json({ ok: true });
}
