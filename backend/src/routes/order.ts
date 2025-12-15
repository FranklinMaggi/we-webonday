// backend/src/routes/order.ts
import type { Env } from "../types/env";
import { OrderSchema } from "../schemas/orderSchema";
import { CartItemSchema } from "../schemas/cartSchema";
import { z } from "zod";
import { logActivity } from "../lib/logActivity";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Input accettato per creare un ordine:
 * - visitorId: obbligatorio (Order deriva dal Cart salvato in KV)
 * - userId: opzionale (se logged)
 * - email + dati fatturazione
 *
 * NOTA: items/total dal client vengono ignorati.
 */
const CreateOrderBodySchema = z.object({
  visitorId: z.string().min(1),
  userId: z.string().nullable().optional(),
  email: z.string().email(),

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

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // 1) validate input minimale (no items/total)
  let body: z.infer<typeof CreateOrderBodySchema>;
  try {
    body = CreateOrderBodySchema.parse(rawBody);
  } catch (err) {
    console.error("CreateOrder input validation failed", err);
    return json({ ok: false, error: "Invalid input" }, 400);
  }

  // 2) load cart from KV (source of truth)
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

  // 3) validate cart items via schema (don’t trust KV blindly)
  let items: z.infer<typeof CartItemSchema>[];
  try {
    items = z.array(CartItemSchema).parse(cartParsed.items);
  } catch (err) {
    console.error("Cart items validation failed", err);
    return json({ ok: false, error: "Invalid cart items" }, 400);
  }

  if (items.length === 0) {
    return json({ ok: false, error: "Cart is empty" }, 400);
  }

  // 4) total: ricalcolo deterministico (o usa cartParsed.total ma lo verifichi)
  const computedTotal = items.reduce(
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

    firstName: body.firstName ?? null,
    lastName: body.lastName ?? null,
    phone: body.phone ?? null,
    billingAddress: body.billingAddress ?? null,

    piva: body.piva ?? null,
    businessName: body.businessName ?? null,

    items,
    total: computedTotal,

    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };

  // 5) validate order
  let validatedOrder;
  try {
    validatedOrder = OrderSchema.parse(orderRaw);
  } catch (err) {
    console.error("Order validation failed", err);
    return json({ ok: false, error: "Order validation failed" }, 400);
  }

  // 6) persist
  await env.ORDER_KV.put(`ORDER:${orderId}`, JSON.stringify(validatedOrder));

  // (opzionale ma coerente) snapshot: puoi anche salvare un link cartId/visitorId
  await logActivity(env, "ORDER_CREATED", validatedOrder.userId, {
    orderId,
    total: validatedOrder.total,
    itemCount: validatedOrder.items.length,
    visitorId: body.visitorId,
  });

  return json({ ok: true, orderId });
}
