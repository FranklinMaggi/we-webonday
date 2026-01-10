// ======================================================
// BE || routes/projects/project.start.ts
// CU-1: PROJECT_START (Milestone 1)
// ======================================================
//
// PATTERN:
// - NO Response / NO json()
// - return { project, order }
// - persist su PROJECTS_KV + ORDERS_KV
// ======================================================
/* =========================================================
   AI_SUPERCOMMENT — PROJECT START (CU-1)
   =========================================================
   DOMINIO:
   - Avvio progetto ONE-TIME basato su un Product
   - Milestone 1 = pagamento iniziale

   PERCHÉ ESISTE:
   - Trasformare un Product in un Project reale
   - Congelare condizioni economiche iniziali
   - Generare Order immutabile

   SCELTE ARCHITETTURALI:
   - projectId deterministico (slug)
   - NO nanoid / NO random per dominio business

   NON FA:
   - NON gestisce progress
   - NON gestisce option
   - NON crea subscription

   KV:
   - PROJECTS_KV
   - ORDER_KV

   ERRORI INTENZIONALI:
   - PROJECT_ALREADY_EXISTS
   - MISSING_MILESTONE_1
========================================================= */

import type { Env } from "../../../types/env";
import { ProjectSchema } from "../../../domains/project/project.schema";
import { EconomicOrderSchema } from "../../../domains/order/order.economic.schema.ts";
import { PROJECTS_KEY, ORDER_KEY } from "../../../lib/kv";

/* =========================
   UTILS
========================= */
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type StartProjectBody = {
  businessId: string;
  businessName: string; // usata per slug
  productId: string;

  milestones: {
    step: 1 | 2 | 3;
    amount: number;
    refundablePercent: number;
    label: string;
  }[];

  optionIds?: string[];

  payment: { providerOrderId: string };

  policyVersion?: string;
};

export async function startProject(request: Request, env: Env) {
  // 1) JSON parse sicuro
  let body: StartProjectBody;
  try {
    body = (await request.json()) as StartProjectBody;
  } catch {
    throw new Error("INVALID_JSON");
  }

  const now = new Date().toISOString();

  // 2) ProjectID deterministico
  const projectId = `${slugify(body.businessName)}-${slugify(body.productId)}`;

  // 3) Guard: se esiste già -> errore
  const pKey = PROJECTS_KEY(body.businessId, projectId);
  const existing = await env.PROJECTS_KV.get(pKey);
  if (existing) throw new Error("PROJECT_ALREADY_EXISTS");

  const m1 = body.milestones?.find((m) => m.step === 1);
  if (!m1) throw new Error("MISSING_MILESTONE_1");

  // 4) Crea order milestone 1
  const order = EconomicOrderSchema.parse({
    id: crypto.randomUUID(),
    type: "PROJECT_START",
    businessId: body.businessId,
    projectId,
    productId: body.productId,
    amount: m1.amount,
    refundablePercent: m1.refundablePercent,
    payment: {
      provider: "paypal",
      providerOrderId: body.payment.providerOrderId,
      status: "PAID",
    },
    policyAccepted: true,
    policyVersion: body.policyVersion ?? "v1",
    createdAt: now,
  });

  // 5) Crea project (milestone1 pagata + orderId collegato)
  const project = ProjectSchema.parse({
    id: projectId,
    productId: body.productId,
    businessId: body.businessId,
    status: "STARTED",
    milestones: body.milestones.map((m) => ({
      ...m,
      paid: m.step === 1,
      paidAt: m.step === 1 ? now : undefined,
      orderId: m.step === 1 ? order.id : undefined,
    })),
    optionIds: body.optionIds ?? [],
    createdAt: now,
    updatedAt: now,
  });

  // 6) Persistenza KV (project + order)
  await env.PROJECTS_KV.put(pKey, JSON.stringify(project));
  await env.ORDER_KV.put(ORDER_KEY(order.id), JSON.stringify(order));

  return { project, order };
}
// ============================================================
// AI-SUPERCOMMENT
// PROJECT || START (CU-1)
// ============================================================
//
// RESPONSABILITÀ:
// - Creare Project ONE-TIME per Product
// - Marcare milestone 1 come pagata
// - Generare Order immutabile (PROJECT_START)
//
// INPUT:
// - businessId
// - productId
// - milestones (step 1 obbligatorio)
//
// OUTPUT:
// - Project status = STARTED
// - Milestone 1 paid
//
// NON FA:
// - NON valida options
// - NON crea subscription
// - NON gestisce recurring
//
// PERCHE:
// - Project è dominio separato
// - Le option entrano solo dopo (CU OPTION_ADD)
//
// KV:
// - PROJECTS_KV → PROJECT:{businessId}:{projectId}
// - ORDER_KV    → ORDER:{orderId}
// ============================================================
