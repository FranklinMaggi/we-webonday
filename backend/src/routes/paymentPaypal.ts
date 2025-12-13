import type { Env } from "../types/env";
import { OrderSchema } from "../schemas/orderSchema";
import type { CartItemDTO } from "../schemas/cartSchema";

// ==========================
// Helper: PayPal Access Token
// ==========================
async function getPaypalAccessToken(env: Env): Promise<string> {
  // Log diagnostico (non stampa mai valori segreti)
  console.log("PayPal env check", {
    clientIdPresent: !!env.PAYPAL_CLIENT_ID,
    secretPresent: !!env.PAYPAL_SECRET,
    apiBase: env.PAYPAL_API_BASE,
  });

  // Controllo preliminare env
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

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

// =================================================
// POST /api/payment/paypal/create-order
// =================================================
export async function createPaypalOrder(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as {
    userId?: string;
    email?: string;
    piva?: string;
    businessName?: string;
    items?: CartItemDTO[];
    total?: number;
  };

  // ===== VALIDAZIONE BASE =====
  if (
    !body.userId ||
    !body.email ||
    !Array.isArray(body.items) ||
    typeof body.total !== "number"
  ) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ===== CREA ORDINE INTERNO (COERENTE CON OrderSchema) =====
  const orderId = crypto.randomUUID();

  const orderRaw = {
    id: orderId,
    userId: body.userId,
    email: body.email,
    piva: body.piva,
    businessName: body.businessName,
    items: body.items,
    total: body.total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // Validazione con Zod
  const order = OrderSchema.parse(orderRaw);

  await env.ORDER_KV.put(`ORDER:${orderId}`, JSON.stringify(order));

  // ===== CREA ORDER PAYPAL =====
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
    return new Response(
      JSON.stringify({ ok: false, error: "PayPal create error", details: txt }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const paypalOrder = (await paypalRes.json()) as { id: string };

  // ===== AGGIORNA ORDINE CON DATI PAYPAL =====
  await env.ORDER_KV.put(
    `ORDER:${orderId}`,
    JSON.stringify({
      ...order,
      paymentProvider: "paypal",
      paymentStatus: "pending",
      paypalOrderId: paypalOrder.id,
    })
  );

  return new Response(
    JSON.stringify({
      ok: true,
      orderId,
      paypalOrderId: paypalOrder.id,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

// =================================================
// POST /api/payment/paypal/capture-order
// =================================================
export async function capturePaypalOrder(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as {
    paypalOrderId?: string;
    orderId?: string;
  };

  if (!body.paypalOrderId || !body.orderId) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing ids" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const raw = await env.ORDER_KV.get(`ORDER:${body.orderId}`);
  if (!raw) {
    return new Response(
      JSON.stringify({ ok: false, error: "Order not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const order = JSON.parse(raw);

  const accessToken = await getPaypalAccessToken(env);

  const capRes = await fetch(
    `${env.PAYPAL_API_BASE}/v2/checkout/orders/${body.paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: "{}", // body vuoto, come da API PayPal
    }
  );

  if (!capRes.ok) {
    const txt = await capRes.text();
    console.error("PayPal capture error:", txt);
    return new Response(
      JSON.stringify({ ok: false, error: "PayPal capture error", details: txt }),
      { status: 500, headers: { "Content-Type": "application/json" } }
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

  return new Response(
    JSON.stringify({ ok: true }),
    { headers: { "Content-Type": "application/json" } }
  );
}
