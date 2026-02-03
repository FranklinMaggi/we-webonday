/**
 * ======================================================
 * CHECKOUT ORDER — WRITE SIDE (V2)
 * File: backend/src/routes/orders/checkoutOrders.write.ts
 * ======================================================
 *
 * RUOLO:
 * - Trasformare un CheckoutOrder DRAFT in ordine pagabile
 * - Congelare configurazione e pricing
 *
 * NON FA:
 * - NON integra PayPal
 * - NON crea Project
 * - NON crea EconomicOrder
 *
 * SOURCE OF TRUTH:
 * - CheckoutOrderDomainSchema
 *
 * FLOW:
 * - DRAFT → PENDING
 * ======================================================
 */

import { z } from "zod";
import type { Env } from "../../../types/env";
import { CheckoutOrderDomainSchema } from "../order.checkout.schema";
import { json } from "../../auth/route/helper/https";

/* =========================
   INPUT SCHEMA
========================= */
/**
 * Input minimo per finalizzare un checkout.
 * Il pricing viene SEMPRE ricalcolato dal backend.
 */
const FinalizeCheckoutSchema = z.object({
  orderId: z.string().uuid(),

  items: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      price: z.number().nonnegative(),
      quantity: z.number().int().positive().default(1),
    })
  ),
});

/* ======================================================
   POST /api/orders/checkout/finalize
====================================================== */
export async function finalizeCheckoutOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body: unknown;

  // 1️⃣ JSON parse sicuro
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, request, env, 400);
  }

  // 2️⃣ Validazione input
  const parsed = FinalizeCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { ok: false, error: "INVALID_INPUT", issues: parsed.error.format() },
      request,
      env,
      400
    );
  }

  const { orderId, items } = parsed.data;

  // 3️⃣ Carica draft
  const raw = await env.ORDER_KV.get(`ORDER:${orderId}`);
  if (!raw) {
    return json({ ok: false, error: "ORDER_NOT_FOUND" }, request, env, 404);
  }

  let draft;
  try {
    draft = CheckoutOrderDomainSchema.parse(JSON.parse(raw));
  } catch {
    return json({ ok: false, error: "CORRUPTED_ORDER" }, request, env, 500);
  }

  if (draft.status !== "draft") {
    return json(
      { ok: false, error: "ORDER_NOT_DRAFT", status: draft.status },
      request,
      env,
      409
    );
  }

  if (!items.length) {
    return json(
      { ok: false, error: "EMPTY_ITEMS" },
      request,
      env,
      400
    );
  }

  // 4️⃣ Calcolo totale deterministico
  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // 5️⃣ Congelamento ordine → pending
  const now = new Date().toISOString();

  const pendingOrder = CheckoutOrderDomainSchema.parse({
    ...draft,
    status: "pending",
    items,
    total,
    updatedAt: now,
  });

  // 6️⃣ Persistenza
  await env.ORDER_KV.put(
    `ORDER:${orderId}`,
    JSON.stringify(pendingOrder)
  );

  // 7️⃣ Response
  return json(
    {
      ok: true,
      orderId,
      status: "pending",
      total,
      currency: pendingOrder.currency,
    },
    request,
    env,
    200
  );
}
