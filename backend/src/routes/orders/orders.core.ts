// routes/orders/orders.core.ts

/**
 * ======================================================
 * ORDERS — CORE DOMAIN (WRITE SIDE)
 * ======================================================
 *
 * RESPONSABILITÀ:
 * - Creazione ordine (checkout)
 * - Applicazione regole di business
 * - Enforcement policy legale
 * - Uso del carrello come SINGLE SOURCE OF TRUTH
 *
 * PRINCIPI:
 * - Il client NON può:
 *   - inviare items
 *   - inviare total
 * - Tutti i dati economici sono ricalcolati dal backend
 * - La policy è BLOCCANTE se l’utente è loggato
 *
 * FLUSSO:
 * 1. Parse input minimo
 * 2. Verifica policy (se userId presente)
 * 3. Caricamento carrello da KV
 * 4. Validazione items
 * 5. Calcolo deterministico del totale
 * 6. Persistenza ordine (status = pending)
 * 7. Log attività
 */

import type { Env } from "../../types/env";
import { z } from "zod";
import { OrderSchema } from "../../schemas/core/orderSchema";
import { CartItemSchema } from "../../schemas/core/cartSchema";
import { logActivity } from "../../lib/logActivity";
import type { OrderStatus } from "../../schemas/core/orderSchema";

/* =========================
   ORDER STATE MACHINE
========================= */

const ORDER_TRANSITIONS = {
    draft: ["pending", "deleted"],
  
    pending: ["confirmed", "deleted"],
  
    confirmed: ["processed", "deleted"],
  
    processed: ["completed"],
  
    completed: [],
  
    suspended: ["deleted"],
  
    deleted: [],
  } as const satisfies Record<OrderStatus, readonly OrderStatus[]>;
export function assertTransition(from: OrderStatus, to: OrderStatus) {
  const allowed = ORDER_TRANSITIONS[from] as readonly OrderStatus[];
  
  if (!allowed.includes(to)) {
    throw new Error(`Invalid order transition ${from} → ${to}`);
  }
}

/* =========================
   CREATE ORDER
========================= */

const CreateOrderBodySchema = z.object({
  visitorId: z.string().min(1),
  userId: z.string().nullable().optional(),
  email: z.string().email(),
  policyVersion: z.string().min(1),

  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  billingAddress: z.string().nullable().optional(),

  piva: z.string().nullable().optional(),
  businessName: z.string().nullable().optional(),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function createOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = CreateOrderBodySchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_INPUT" }, 400);
  }

  /* 🔒 POLICY ENFORCEMENT */
  if (body.userId) {
    const latest = await env.POLICY_KV.get("POLICY_LATEST");
    if (!latest) {
      return json({ ok: false, error: "POLICY_NOT_AVAILABLE" }, 500);
    }

    if (body.policyVersion !== latest) {
      return json({ ok: false, error: "POLICY_OUTDATED" }, 409);
    }

    const accepted = await env.POLICY_KV.get(
      `POLICY_ACCEPTANCE:${body.userId}:${latest}`
    );

    if (!accepted) {
      return json({ ok: false, error: "POLICY_NOT_ACCEPTED" }, 403);
    }
  }

  /* 🛒 LOAD CART */
  const cartRaw = await env.CART_KV.get(`CART:${body.visitorId}`);
  if (!cartRaw) {
    return json({ ok: false, error: "CART_NOT_FOUND" }, 404);
  }

  let cart;
  try {
    cart = JSON.parse(cartRaw);
  } catch {
    return json({ ok: false, error: "CORRUPTED_CART" }, 500);
  }

  let items;
  try {
    items = z.array(CartItemSchema).parse(cart.items);
  } catch {
    return json({ ok: false, error: "INVALID_CART_ITEMS" }, 400);
  }

  if (items.length === 0) {
    return json({ ok: false, error: "EMPTY_CART" }, 400);
  }

  /* 💰 TOTAL (DETERMINISTIC) */
  const total = items.reduce(
    (sum, i) =>
      sum +
      i.basePrice +
      i.options.reduce((s, o) => s + o.price, 0),
    0
  );

  const orderId = crypto.randomUUID();

  const order = OrderSchema.parse({
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
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  await env.ORDER_KV.put(`ORDER:${orderId}`, JSON.stringify(order));

  await logActivity(env, "ORDER_CREATED", order.userId, {
    orderId,
    total,
    itemCount: items.length,
    visitorId: body.visitorId,
    policyVersion: order.policyVersion,
  });

  return json({ ok: true, orderId });
}
