/**
 * ======================================================
 * BE || ADMIN || KPI AGGREGATION (V2)
 * ======================================================
 *
 * AI-SUPERCOMMENT — KPI DASHBOARD
 *
 * RUOLO:
 * - Aggregare metriche globali per Admin Dashboard
 *
 * COSA FA:
 * - Conta CheckoutOrders per stato
 * - Calcola revenue da ordini pagati
 * - Conta utenti totali
 *
 * SOURCE OF TRUTH:
 * - CheckoutOrderDomainSchema
 *
 * KV:
 * - ORDER_KV
 * - ON_USERS_KV
 * ======================================================
 */

import type { Env } from "../../../types/env";
import { json } from "../../auth/route/helper/https";
import {
  CheckoutOrderDomainSchema,
} from "../../order/order.checkout.schema";

export async function getAdminKPI(
  request: Request,
  env: Env
): Promise<Response> {

  const ordersList =
    await env.ORDER_KV.list({ prefix: "ORDER:" });

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
      const order =
        CheckoutOrderDomainSchema.parse(JSON.parse(raw));

      ordersTotal++;

      switch (order.status) {
        case "pending": ordersPending++; break;
        case "confirmed": ordersConfirmed++; break;
        case "processed": ordersProcessed++; break;
        case "completed": ordersCompleted++; break;
        case "deleted": ordersDeleted++; break;
      }

      // ✅ pagamento implicito nello stato
      if (
        ["confirmed", "processed", "completed"]
          .includes(order.status) &&
        order.total !== undefined
      ) {
        paidOrders++;
        revenueTotal += order.total;
      }

    } catch {
      // KPI non bloccanti
    }
  }

  const usersList =
    await env.ON_USERS_KV.list({ prefix: "USER:" });

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
          total: usersList.keys.length,
        },
      },
    },
    request,
    env
  );
}
