/**
 * ============================================================
 * ADMIN — ORDER ACTIONS
 * File: backend/src/routes/admin/orders.actions.ts
 *
 * RESPONSABILITÀ:
 * - Mutazioni ADMIN sugli ordini
 * - Applicazione rigorosa della state machine
 * - Cancellazione logica motivata
 * - Clonazione ordini cancellati
 *
 * PRINCIPI:
 * - "deleted" è una cancellazione LOGICA (storico preservato)
 * - Un ordine "deleted" NON viene mai riattivato
 * - La reintegrazione avviene SOLO tramite CLONE
 * - transitionOrder è l'UNICO punto di cambio stato
 * - Ogni mutazione è auditata
 * ============================================================
 */

import type { Env } from "../../types/env";
import { z } from "zod";

import { OrderSchema } from "../../schemas/core/orderSchema";
import { assertTransition } from "../orders/orders.core";
import { logActivity } from "../../lib/logActivity";
import { json } from "../../lib/https";

/* ============================================================
   SCHEMI INPUT
============================================================ */

/**
 * ADMIN — transizione generica di stato
 */
const AdminOrderTransitionSchema = z.object({
  id: z.string().uuid(),
  nextStatus: z.enum([
    "confirmed",
    "processed",
    "completed",
    "deleted",
  ]),
});

/**
 * ADMIN — delete motivato
 */
const AdminOrderDeleteSchema = z.object({
  id: z.string().uuid(),
  reason: z.literal("admin").default("admin"),
});

/**
 * ADMIN — clone ordine cancellato
 */
const AdminOrderCloneSchema = z.object({
  id: z.string().uuid(), // orderId originale (deleted)
});

/* ============================================================
   ADMIN — TRANSITION ORDER (CORE)
============================================================ */

export async function transitionOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, request, env, 400);
  }

  const parsed = AdminOrderTransitionSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  const { id, nextStatus } = parsed.data;

  const raw = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!raw) {
    return json({ ok: false, error: "ORDER_NOT_FOUND" }, request, env, 404);
  }

  let order;
  try {
    order = OrderSchema.parse(JSON.parse(raw));
  } catch {
    return json({ ok: false, error: "CORRUPTED_ORDER" }, request, env, 500);
  }

  /* 🔒 State machine */
  try {
    assertTransition(order.status, nextStatus);
  } catch {
    return json(
      {
        ok: false,
        error: "INVALID_STATE_TRANSITION",
        from: order.status,
        to: nextStatus,
      },
      request,
      env,
      409
    );
  }

  const updated = OrderSchema.parse({
    ...order,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  });

  await env.ORDER_KV.put(`ORDER:${id}`, JSON.stringify(updated));

  await logActivity(env, "ORDER_STATUS_FORCED_BY_ADMIN", order.userId, {
    orderId: id,
    from: order.status,
    to: nextStatus,
  });

  return json(
    {
      ok: true,
      orderId: id,
      previousStatus: order.status,
      status: nextStatus,
    },
    request,
    env
  );
}

/* ============================================================
   ADMIN — DELETE ORDER (LOGICO + MOTIVATO)
============================================================ */

export async function deleteOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, request, env, 400);
  }

  const parsed = AdminOrderDeleteSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  const { id, reason } = parsed.data;

  const raw = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!raw) {
    return json({ ok: false, error: "ORDER_NOT_FOUND" }, request, env, 404);
  }

  const order = OrderSchema.parse(JSON.parse(raw));

  assertTransition(order.status, "deleted");

  const updated = OrderSchema.parse({
    ...order,
    status: "deleted",
    cancelReason: reason,
    updatedAt: new Date().toISOString(),
  });

  await env.ORDER_KV.put(`ORDER:${id}`, JSON.stringify(updated));

  await logActivity(env, "ORDER_DELETED_BY_ADMIN", order.userId, {
    orderId: id,
    from: order.status,
    reason,
  });

  return json(
    {
      ok: true,
      orderId: id,
      status: "deleted",
      cancelReason: reason,
    },
    request,
    env
  );
}

/* ============================================================
   ADMIN — CLONE ORDER (REINTEGRAZIONE)
============================================================ */

export async function cloneOrder(
  request: Request,
  env: Env
): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, request, env, 400);
  }

  const parsed = AdminOrderCloneSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  const { id } = parsed.data;

  const raw = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!raw) {
    return json({ ok: false, error: "ORDER_NOT_FOUND" }, request, env, 404);
  }

  let original;
  try {
    original = OrderSchema.parse(JSON.parse(raw));
  } catch {
    return json({ ok: false, error: "CORRUPTED_ORDER" }, request, env, 500);
  }

  if (original.status !== "deleted") {
    return json(
      {
        ok: false,
        error: "ORDER_NOT_DELETED",
        currentStatus: original.status,
      },
      request,
      env,
      409
    );
  }

  const newOrderId = crypto.randomUUID();

  const cloned = OrderSchema.parse({
    ...original,
    id: newOrderId,
    status: "pending",
    paypalOrderId: null,
    paypalCapture: null,
    paymentStatus: "pending",
    cancelReason: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: undefined,
  });

  await env.ORDER_KV.put(
    `ORDER:${newOrderId}`,
    JSON.stringify(cloned)
  );

  await logActivity(env, "ORDER_CLONED_FROM_DELETED", original.userId, {
    fromOrderId: id,
    toOrderId: newOrderId,
  });

  return json(
    {
      ok: true,
      orderId: newOrderId,
      status: "pending",
      clonedFrom: id,
    },
    request,
    env
  );
}

/**
 * PERCHE:
 * un ordine cancellato è immutabile per audit.
 * La reintegrazione crea sempre una nuova entità pulita e pagabile.
 */
