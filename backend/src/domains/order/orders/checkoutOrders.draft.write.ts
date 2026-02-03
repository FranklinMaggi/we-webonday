/**
 * ======================================================
 * CHECKOUT ORDER — DRAFT CREATION (V2)
 * File: backend/src/routes/orders/checkoutOrders.draft.write.ts
 * ======================================================
 *
 * RUOLO:
 * - Creare un CheckoutOrder in stato DRAFT
 * - Separare configurazione / preview dal pagamento
 *
 * CARATTERISTICHE:
 * - NON pagabile
 * - NON crea Project
 * - Usato per preview FE + Admin
 *
 * SOURCE OF TRUTH:
 * - CheckoutOrderDomainSchema
 *
 * ======================================================
 */

import { z } from "zod";
import type { Env } from "../../../types/env";
import {
  CheckoutOrderDomainSchema,
  OrderKindSchema,
} from "../order.checkout.schema";
import { json } from "../../auth/route/helper/https";

/* =========================
   INPUT SCHEMA
========================= */
/**
 * INPUT MINIMO per creare un draft.
 * Tutto il resto è MUTABILE.
 */
const CreateCheckoutDraftSchema = z.object({
  solutionId: z.string().min(1),

  orderKind: OrderKindSchema, // product | project

  productIds: z.array(z.string()).optional(),

  businessId: z.string().min(1),

  businessSnapshot: z.object({
    name: z.string().min(1),
    city: z.string().optional(),
    sector: z.string().optional(),
  }),
});

/* ======================================================
   POST /api/orders/checkout/draft
====================================================== */
export async function createCheckoutOrderDraft(
  request: Request,
  env: Env
): Promise<Response> {
  let body: unknown;

  // 1️⃣ JSON parse sicuro
  try {
    body = await request.json();
  } catch {
    return json(
      { ok: false, error: "INVALID_JSON" },
      request,
      env,
      400
    );
  }

  // 2️⃣ Validazione input
  const parsed = CreateCheckoutDraftSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { ok: false, error: "INVALID_INPUT", issues: parsed.error.format() },
      request,
      env,
      400
    );
  }

  const {
    solutionId,
    orderKind,
    productIds,
    businessId,
    businessSnapshot,
  } = parsed.data;

  const now = new Date().toISOString();
  const orderId = crypto.randomUUID();

  // 3️⃣ Creazione draft
  const draft = CheckoutOrderDomainSchema.parse({
    id: orderId,
    status: "draft",
    orderKind,

    solutionId,

    productIds: orderKind === "product" ? productIds : undefined,

    businessId,
    businessSnapshot,

    currency: "EUR",

    createdAt: now,
    updatedAt: now,
  });

  // 4️⃣ Persistenza
  await env.ORDER_KV.put(
    `ORDER:${orderId}`,
    JSON.stringify(draft)
  );

  // 5️⃣ Response minimale
  return json(
    {
      ok: true,
      orderId,
      status: "draft",
    },
    request,
    env,
    201
  );
}
