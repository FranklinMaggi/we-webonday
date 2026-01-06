/**
 * ======================================================
 * BE || ADMIN || CHECKOUT ORDERS — WRITE SIDE (V2)
 * ======================================================
 *
 * AI-SUPERCOMMENT — RESPONSABILITÀ
 *
 * RUOLO:
 * - Espone AZIONI ADMIN sugli CheckoutOrders
 * - Applica RIGOROSAMENTE la state machine
 * - Registra AUDIT di ogni mutazione
 *
 * COSA PUÒ FARE:
 * - delete (cancellazione logica)
 * - transition (forzatura stato lecita)
 * - clone (solo da deleted → nuova entità)
 *
 * COSA NON PUÒ FARE:
 * - NON crea ordini
 * - NON gestisce pagamento
 * - NON ricalcola prezzi
 * - NON crea Project o EconomicOrder
 *
 * INVARIANTI CRITICHE:
 * - Un ordine `deleted` è IMMUTABILE
 * - Nessuna transizione fuori dalla state machine
 * - Ogni mutazione è AUDITATA
 *
 * SOURCE OF TRUTH:
 * - CheckoutOrderDomainSchema
 * - assertCheckoutOrderTransition()
 *
 * KV:
 * - ORDER_KV → ORDER:{orderId}
 *
 * PERCHÉ ESISTE:
 * - Separare il POTERE ADMIN dalla logica di checkout
 * - Garantire tracciabilità e sicurezza
 *
 * FE TARGET:
 * - Admin Dashboard (azioni manuali)
 * ======================================================
 */

import { z } from "zod";
import type { Env } from "../../../types/env";
import {
  CheckoutOrderDomainSchema,
  OrderStatusSchema,
  assertCheckoutOrderTransition
} from "../../../schemas/orders/checkoutOrderSchema";
import { json } from "../../../lib/https";
import { logActivity } from "../../../lib/logActivity";

/* =========================
   INPUT SCHEMAS
========================= */

const AdminOrderIdSchema = z.object({
  orderId: z.string().uuid(),
});

const AdminOrderTransitionSchema = z.object({
  orderId: z.string().uuid(),
  nextStatus: OrderStatusSchema,
});

/* =========================
   LOAD ORDER HELPER
========================= */
async function loadOrder(env: Env, orderId: string) {
  const raw = await env.ORDER_KV.get(`ORDER:${orderId}`);
  if (!raw) throw new Error("ORDER_NOT_FOUND");

  return CheckoutOrderDomainSchema.parse(JSON.parse(raw));
}

/* ======================================================
   ADMIN — DELETE ORDER (LOGICAL)
   draft | pending | confirmed → deleted
====================================================== */
export async function deleteOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = AdminOrderIdSchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  let order;
  try {
    order = await loadOrder(env, body.orderId);
  } catch (err: any) {
    return json({ ok: false, error: err.message }, request, env, 404);
  }

  try {
    assertCheckoutOrderTransition(order.status, "deleted");
  } catch {
    return json(
      {
        ok: false,
        error: "INVALID_STATE_TRANSITION",
        from: order.status,
        to: "deleted",
      },
      request,
      env,
      409
    );
  }

  const updated = {
    ...order,
    status: "deleted",
    updatedAt: new Date().toISOString(),
  };

  await env.ORDER_KV.put(
    `ORDER:${order.id}`,
    JSON.stringify(updated)
  );

  await logActivity(env, "ADMIN_ORDER_DELETED", order.businessId, {
    orderId: order.id,
    orderKind: order.orderKind,
  });

  return json({ ok: true, order: updated }, request, env);
}

/* ======================================================
   ADMIN — FORCE STATE TRANSITION
====================================================== */
export async function transitionOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = AdminOrderTransitionSchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  let order;
  try {
    order = await loadOrder(env, body.orderId);
  } catch (err: any) {
    return json({ ok: false, error: err.message }, request, env, 404);
  }

  try {
    assertCheckoutOrderTransition(order.status, body.nextStatus);
  } catch {
    return json(
      {
        ok: false,
        error: "INVALID_STATE_TRANSITION",
        from: order.status,
        to: body.nextStatus,
      },
      request,
      env,
      409
    );
  }

  const updated = {
    ...order,
    status: body.nextStatus,
    updatedAt: new Date().toISOString(),
  };

  await env.ORDER_KV.put(
    `ORDER:${order.id}`,
    JSON.stringify(updated)
  );

  await logActivity(env, "ADMIN_ORDER_STATUS_CHANGED", order.businessId, {
    orderId: order.id,
    from: order.status,
    to: body.nextStatus,
    orderKind: order.orderKind,
  });

  return json(
    {
      ok: true,
      orderId: order.id,
      status: body.nextStatus,
    },
    request,
    env
  );
}

/* ======================================================
   ADMIN — CLONE DELETED ORDER
====================================================== */
export async function cloneDeletedOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = AdminOrderIdSchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  let original;
  try {
    original = await loadOrder(env, body.orderId);
  } catch (err: any) {
    return json({ ok: false, error: err.message }, request, env, 404);
  }

  if (original.status !== "deleted") {
    return json(
      {
        ok: false,
        error: "ORDER_NOT_DELETED",
        status: original.status,
      },
      request,
      env,
      409
    );
  }

  const newOrderId = crypto.randomUUID();
  const now = new Date().toISOString();

  const cloned = CheckoutOrderDomainSchema.parse({
    ...original,
    id: newOrderId,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  await env.ORDER_KV.put(
    `ORDER:${newOrderId}`,
    JSON.stringify(cloned)
  );

  await logActivity(env, "ADMIN_ORDER_CLONED", original.businessId, {
    fromOrderId: original.id,
    toOrderId: newOrderId,
    orderKind: original.orderKind,
  });

  return json(
    {
      ok: true,
      orderId: newOrderId,
      status: "pending",
      clonedFrom: original.id,
    },
    request,
    env
  );
}
