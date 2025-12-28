import type { Env } from "../../types/env";
import { json } from "../../lib/https";
import { OrderSchema } from "../../schemas/core/orderSchema";

export async function getAdminKPI(
  request: Request,
  env: Env
): Promise<Response> {

  /* ======================================================
     ORDERS — KPI
  ====================================================== */

  const ordersList = await env.ORDER_KV.list({ prefix: "ORDER:" });

  let ordersTotal = 0;

  let ordersPending = 0;
  let ordersConfirmed = 0;
  let ordersProcessed = 0;
  let ordersCompleted = 0;
  let ordersDeleted = 0;

  let paidOrders = 0;
  let revenueTotal = 0;

  for (const key of ordersList.keys) {
    const raw = await env.ORDER_KV.get(key.name);
    if (!raw) continue;

    try {
      const order = OrderSchema.parse(JSON.parse(raw));

      ordersTotal++;

      switch (order.status) {
        case "pending":
          ordersPending++;
          break;
        case "confirmed":
          ordersConfirmed++;
          break;
        case "processed":
          ordersProcessed++;
          break;
        case "completed":
          ordersCompleted++;
          break;
        case "deleted":
          ordersDeleted++;
          break;
      }

      if (order.paymentStatus === "paid") {
        paidOrders++;
        revenueTotal += order.total;
      }

    } catch {
      // ordine corrotto → ignorato (KPI non bloccanti)
    }
  }

  /* ======================================================
     USERS — KPI
  ====================================================== */

  const usersList = await env.ON_USERS_KV.list({ prefix: "USER:" });
  const usersTotal = usersList.keys.length;

  /* ======================================================
     RESPONSE
  ====================================================== */

  return json(
    {
      ok: true,
      kpi: {
        orders: {
          total: ordersTotal,
          pending: ordersPending,
          confirmed: ordersConfirmed,
          processed: ordersProcessed,
          completed: ordersCompleted,
          deleted: ordersDeleted,
        },
        revenue: {
          paidOrders,
          totalAmount: revenueTotal,
        },
        users: {
          total: usersTotal,
        },
      },
    },
    request,
    env
  );
}
