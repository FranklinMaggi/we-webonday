/**
 * ============================================================
 * Admin Orders API
 * File: frontend/src/lib/adminApi/orders.ts
 *
 * RESPONSABILITÀ:
 * - Tipi condivisi per ORDINI admin
 * - Chiamate API admin (list / detail / actions)
 * - Label leggibili per stati e motivi
 *
 * PRINCIPI:
 * - Il backend è source of truth
 * - Qui NON c’è logica di business
 * - Questo file è usato SOLO da pagine admin
 * ============================================================
 */

import { adminFetch } from "./client";

/* ============================================================
   ORDER STATUS
============================================================ */

/**
 * Stati ordine (DEVONO combaciare con OrderSchema backend)
 */
export type AdminOrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "processed"
  | "completed"
  | "deleted";

/**
 * Label leggibili per UI
 */
export const ORDER_STATUS_LABEL: Record<AdminOrderStatus, string> = {
  draft: "Bozza",
  pending: "In attesa",
  confirmed: "Confermato",
  processed: "In lavorazione",
  completed: "Completato",
  deleted: "Eliminato",
};

/* ============================================================
   CANCEL REASON
============================================================ */

export type AdminOrderCancelReason =
  | "admin"
  | "user"
  | "payment_failed";

export const ORDER_CANCEL_REASON_LABEL: Record<
  AdminOrderCancelReason,
  string
> = {
  admin: "Cancellato da admin",
  user: "Cancellato dall’utente",
  payment_failed: "Pagamento fallito",
};

/* ============================================================
   ITEMS
============================================================ */

export interface AdminOrderItemOption {
  id: string;
  name: string;
  price: number;
}

export interface AdminOrderItem {
  title: string;
  total: number;
  options: AdminOrderItemOption[];
}

/* ============================================================
   ORDER DTO (ADMIN)
============================================================ */

export interface AdminOrder {
  id: string;
  userId: string | null;

  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;

  billingAddress?: string | null;
  piva?: string | null;
  businessName?: string | null;

  policyVersion: string;

  items: AdminOrderItem[];

  total: number;
  status: AdminOrderStatus;
  cancelReason?: AdminOrderCancelReason;

  createdAt: string;
  updatedAt?: string;
}

/* ============================================================
   API RESPONSES
============================================================ */

interface AdminOrdersListResponse {
  ok: boolean;
  orders: AdminOrder[];
}

interface AdminOrderResponse {
  ok: boolean;
  order: AdminOrder;
}

/* ============================================================
   API CALLS — READ
============================================================ */

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const res = await adminFetch<AdminOrdersListResponse>(
    "/api/admin/orders/list"
  );
  return res.orders;
}

export async function getAdminOrder(id: string): Promise<AdminOrder> {
  const res = await adminFetch<AdminOrderResponse>(
    `/api/admin/order?id=${id}`
  );
  return res.order;
}
/* ============================================================
   API CALLS — ACTIONS (ADMIN)
============================================================ */

/**
 * Transizione generica stato ordine
 * (confirmed / processed / completed / deleted)
 */
export function transitionAdminOrder(
  id: string,
  nextStatus: AdminOrderStatus
) {
  return adminFetch("/api/admin/order/transition", {
    method: "POST",
    body: JSON.stringify({ id, nextStatus }),
  });
}

/**
 * Delete logico motivato (admin)
 */
export function deleteAdminOrder(id: string) {
  return adminFetch("/api/admin/order/delete", {
    method: "POST",
    body: JSON.stringify({ id, reason: "admin" }),
  });
}

/**
 * Clone ordine cancellato
 */
export function cloneAdminOrder(id: string) {
  return adminFetch("/api/admin/order/clone", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
