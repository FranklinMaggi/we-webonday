/**
 * ============================================================
 * Admin Order Actions
 * File: backend/src/routes/admin/orders.actions.ts
 *
 * Responsabilità:
 * - Consentire azioni ADMIN sugli ordini
 * - Applicare correttamente la state machine
 * - Loggare ogni mutazione (audit)
 *
 * NOTE:
 * - "deleted" è una cancellazione LOGICA (storico preservato)
 * - Non esiste più lo stato "cancelled"
 * ============================================================
 */
/**
 * ============================================================
 *ADMIN — ORDER CLONE & STATE ACTIONS
* File: backend/src/routes/admin/orders.actions.ts
*
* RESPONSABILITÀ:
* - Mutazioni ADMIN sugli ordini
* - Applicazione rigorosa della state machine
* - Clonazione ordini cancellati (reinserimento corretto)
*
* PRINCIPI:
* - Un ordine "deleted" NON viene mai riattivato
* - La reintegrazione crea SEMPRE una nuova entità ordine
* - Ogni mutazione è auditata
* ============================================================
*/
import type { Env } from "../../types/env";
import { OrderSchema } from "../../schemas/core/orderSchema";
import { assertTransition } from "../orders/orders.core";
import { logActivity } from "../../lib/logActivity";
import { json } from "../../lib/https";
import { z } from "zod";

/**
 * Payload minimo per azioni admin su ordine
 */
const AdminOrderActionSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Mutazione stato ordine (ADMIN)
 */
async function updateOrderStatus(
  request: Request,
  env: Env,
  nextStatus: "confirmed" | "deleted"
): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, request, env, 400);
  }

  const parsed = AdminOrderActionSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  const { id } = parsed.data;

  const raw = await env.ORDER_KV.get(`ORDER:${id}`);
  if (!raw) {
    return json({ ok: false, error: "NOT_FOUND" }, request, env, 404);
  }

  const order = OrderSchema.parse(JSON.parse(raw));

  // 🔒 State machine (OBBLIGATORIA)
  assertTransition(order.status, nextStatus);

  const updated = {
    ...order,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  await env.ORDER_KV.put(`ORDER:${id}`, JSON.stringify(updated));

  await logActivity(env, "ORDER_STATUS_CHANGED", order.userId, {
    orderId: id,
    from: order.status,
    to: nextStatus,
  });

  return json({ ok: true, order: updated }, request, env);
}

/**
 * ADMIN — conferma ordine
 * pending → confirmed
 */
export function confirmOrder(request: Request, env: Env) {
  return updateOrderStatus(request, env, "confirmed");
}

/**
 * ADMIN — elimina ordine (logico)
 * draft | pending | confirmed → deleted
 */
export function deleteOrder(request: Request, env: Env) {
  return updateOrderStatus(request, env, "deleted");
}
const AdminOrderCloneSchema = z.object({
  id: z.string().uuid(), // orderId originale (deleted)
});
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

  /* =====================
     LOAD ORIGINAL ORDER
  ====================== */
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

  /* =====================
     GUARD — ONLY DELETED
  ====================== */
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

  /* =====================
     CLONE ORDER
  ====================== */
  const newOrderId = crypto.randomUUID();

  const cloned = OrderSchema.parse({
    ...original,
    id: newOrderId,
    status: "pending",
    paypalOrderId: null,
    paypalCapture: null,
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: undefined,
  });

  await env.ORDER_KV.put(
    `ORDER:${newOrderId}`,
    JSON.stringify(cloned)
  );

  /* =====================
     AUDIT LOG
  ====================== */
  await logActivity(env, "ORDER_CLONED_FROM_DELETED", original.userId, {
    fromOrderId: id,
    toOrderId: newOrderId,
  });

  /* =====================
     RESPONSE
  ====================== */
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
// PERCHE: un ordine cancellato è immutabile per audit.
// La reintegrazione crea una nuova entità pulita e pagabile.
const AdminOrderTransitionSchema = z.object({
  id: z.string().uuid(),
  nextStatus: z.enum([
    "confirmed",
    "processed",
    "completed",
    "deleted",
  ]),
});
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

  /* =====================
     LOAD ORDER
  ====================== */
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

  /* =====================
     STATE MACHINE GUARD
  ====================== */
  try {
    assertTransition(order.status, nextStatus);
  } catch (err) {
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

  /* =====================
     UPDATE ORDER
  ====================== */
  const updated = OrderSchema.parse({
    ...order,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  });

  await env.ORDER_KV.put(
    `ORDER:${id}`,
    JSON.stringify(updated)
  );

  /* =====================
     AUDIT LOG
  ====================== */
  await logActivity(env, "ORDER_STATUS_FORCED_BY_ADMIN", order.userId, {
    orderId: id,
    from: order.status,
    to: nextStatus,
  });

  /* =====================
     RESPONSE
  ====================== */
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
