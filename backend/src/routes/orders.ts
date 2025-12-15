// backend/src/routes/orders.ts

/**
 * ======================================================
 * ORDERS DOMAIN
 *
 * WRITE SIDE → public checkout
 * READ SIDE  → admin / reporting
 *
 * Single source of truth for Order lifecycle
 * ======================================================
 */

import type { Env } from "../types/env";
import { z } from "zod";
import { OrderSchema } from "../schemas/orderSchema";
import { CartItemSchema } from "../schemas/cartSchema";
import { logActivity } from "../lib/logActivity";
import type { OrderStatus } from "../schemas/orderSchema";
import { OrderBaseSchema } from "../schemas/orderSchema";

const ORDER_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: [],
  cancelled: [],
} as const satisfies Record<OrderStatus, readonly OrderStatus[]>;

export function assertTransition(from: OrderStatus, to: OrderStatus) {
  const allowed = ORDER_TRANSITIONS[from] as readonly OrderStatus[];
  if (!allowed.includes(to)) {
    throw new Error(`Invalid order transition ${from} → ${to}`);
  }
}

/* =========================
   JSON HELPER (local)
========================= */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ======================================================
   WRITE SIDE — PUBLIC
   POST /api/order
====================================================== */

/**
 * INPUT CREATE ORDER
 * - visitorId: obbligatorio
 * - userId: opzionale (se presente → policy OBBLIGATORIA)
 * - email
 * - policyVersion: OBBLIGATORIA
 *
 * items / total NON vengono accettati dal client
 */
const CreateOrderBodySchema = z.object({
  visitorId: z.string().min(1),

  userId: z.string().nullable().optional(),
  email: z.string().email(),

  // 🔒 VINCOLO LEGALE
  policyVersion: z.string().min(1),

  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  billingAddress: z.string().nullable().optional(),

  piva: z.string().nullable().optional(),
  businessName: z.string().nullable().optional(),
});

export async function createOrder(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  // 1) PARSE INPUT
  let body: z.infer<typeof CreateOrderBodySchema>;
  try {
    body = CreateOrderBodySchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "Invalid input" }, 400);
  }

  // 2) POLICY ENFORCEMENT (HARD)
  if (body.userId) {
    const latestVersion = await env.POLICY_KV.get("POLICY_LATEST");
    if (!latestVersion) {
      return json({ ok: false, error: "POLICY_NOT_AVAILABLE" }, 500);
    }

    if (body.policyVersion !== latestVersion) {
      return json({ ok: false, error: "POLICY_OUTDATED" }, 409);
    }

    const acceptanceKey = `POLICY_ACCEPTANCE:${body.userId}:${latestVersion}`;
    const accepted = await env.POLICY_KV.get(acceptanceKey);

    if (!accepted) {
      return json({ ok: false, error: "POLICY_NOT_ACCEPTED" }, 403);
    }
  }

  // 3) LOAD CART (SOURCE OF TRUTH)
  const cartRaw = await env.CART_KV.get(`CART:${body.visitorId}`);
  if (!cartRaw) {
    return json({ ok: false, error: "Cart not found" }, 404);
  }

  let cartParsed: any;
  try {
    cartParsed = JSON.parse(cartRaw);
  } catch {
    return json({ ok: false, error: "Corrupted cart data" }, 500);
  }

  // 4) VALIDATE CART ITEMS
  let items: z.infer<typeof CartItemSchema>[];
  try {
    items = z.array(CartItemSchema).parse(cartParsed.items);
  } catch {
    return json({ ok: false, error: "Invalid cart items" }, 400);
  }

  if (items.length === 0) {
    return json({ ok: false, error: "Cart is empty" }, 400);
  }

  // 5) TOTAL (DETERMINISTIC)
  const total = items.reduce(
    (sum, i) =>
      sum +
      i.basePrice +
      i.options.reduce((s, o) => s + o.price, 0),
    0
  );

  const orderId = crypto.randomUUID();

  const orderRaw = {
    id: orderId,

    userId: body.userId ?? null,
    email: body.email,

    policyVersion: body.policyVersion,

    firstName: body.firstName ?? null,
    lastName: body.lastName ?? null,
    phone: body.phone ?? null,
    billingAddress: body.billingAddress ?? null,

    piva: body.piva ?? null,
    businessName: body.businessName ?? null,

    items,
    total,

    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };

  // 6) VALIDATE & SAVE
  let validatedOrder;
  try {
    validatedOrder = OrderSchema.parse(orderRaw);
  } catch {
    return json({ ok: false, error: "Order validation failed" }, 400);
  }

  await env.ORDER_KV.put(
    `ORDER:${orderId}`,
    JSON.stringify(validatedOrder)
  );

  await logActivity(env, "ORDER_CREATED", validatedOrder.userId , {
    orderId,
    total,
    itemCount: items.length,
    visitorId: body.visitorId,
    policyVersion: validatedOrder.policyVersion,
  });

  return json({ ok: true, orderId });
}

/* ======================================================
   READ SIDE — ADMIN
====================================================== */

/**
 * Admin summary (no paypalCapture)
 */
const OrderSummarySchema = OrderBaseSchema.omit({
  paypalCapture: true,
});

type OrderSummaryDTO = z.infer<typeof OrderSummarySchema>;

// GET /api/orders/list
export async function listOrders(
  _request: Request,
  env: Env
): Promise<Response> {
  const list = await env.ORDER_KV.list({ prefix: "ORDER:" });

  const orders: OrderSummaryDTO[] = [];

  for (const key of list.keys) {
    const stored = await env.ORDER_KV.get(key.name);
    if (!stored) continue;

    try {
      const parsed = JSON.parse(stored);
      const validated = OrderSummarySchema.parse(parsed);
      orders.push(validated);
    } catch (err) {
      console.error("Invalid order in KV:", key.name, err);
    }
  }

  orders.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return json({ ok: true, orders });
}

// GET /api/order?id=XYZ
export async function getOrder(
  request: Request,
  env: Env
): Promise<Response> {
  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return json({ ok: false, error: "Missing id" }, 400);
  }

  const stored = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!stored) {
    return json({ ok: false, error: "Not found" }, 404);
  }

  try {
    const parsed = JSON.parse(stored);
    const validated = OrderSchema.parse(parsed);
    return json({ ok: true, order: validated });
  } catch (err) {
    console.error("Order validation failed:", id, err);
    return json({ ok: false, error: "Corrupted order data" }, 500);
  }
}
