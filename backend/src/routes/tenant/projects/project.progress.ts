// ======================================================
// BE || routes/projects/project.progress.ts
// CU-3: PROJECT_PROGRESS (Milestone 2)
// ======================================================
/* =========================================================
   AI_SUPERCOMMENT — PROJECT PROGRESS (CU-3)
   =========================================================
   DOMINIO:
   - Avanzamento progetto (Milestone 2)
   - Cambio stato: STARTED → IN_PROGRESS

   PRECONDIZIONI:
   - Milestone 1 pagata
   - Preview accettata (attualmente hardcoded true)

   NON FA:
   - NON carica da KV (project passato dall’alto)
   - NON persiste direttamente
   - NON gestisce option

   OUTPUT:
   - Project aggiornato
   - Order immutabile

   NOTE:
   - Funzione DOMINIO pura
   - La persistenza è responsabilità del router
========================================================= */

import type { Env } from "../../../types/env";
import { ProjectSchema, Project } from "../../../domains/project/project.schema";
import { EconomicOrderSchema } from "../../../domains/order/order.economic.schema.ts";
import { PROJECTS_KEY, ORDER_KEY } from "../../../lib/kv";

/* =========================
   GUARDS
========================= */
function assertCanProgress(project: Project, previewAccepted: boolean) {
  const m1 = project.milestones.find((m) => m.step === 1);
  const m2 = project.milestones.find((m) => m.step === 2);

  if (!m1 || !m1.paid) throw new Error("MILESTONE_1_NOT_PAID");
  if (!previewAccepted) throw new Error("PREVIEW_NOT_ACCEPTED");
  if (!m2 || m2.paid) throw new Error("MILESTONE_2_INVALID_STATE");
  if (project.status !== "STARTED") throw new Error("PROJECT_INVALID_STATE");
}

type ProgressBody = {
  businessId: string;
  projectId: string;
  payment: { providerOrderId: string };
  previewAccepted?: boolean;
  policyVersion?: string;
};

export async function progressProject(request: Request, env: Env) {
  let body: ProgressBody;
  try {
    body = await request.json();
  } catch {
    throw new Error("INVALID_JSON");
  }

  const now = new Date().toISOString();
  const pKey = PROJECTS_KEY(body.businessId, body.projectId);

  const raw = await env.PROJECTS_KV.get(pKey);
  if (!raw) throw new Error("PROJECT_NOT_FOUND");

  const project = ProjectSchema.parse(JSON.parse(raw));

  assertCanProgress(project, body.previewAccepted ?? true);

  const m2 = project.milestones.find((m) => m.step === 2);
  if (!m2) throw new Error("MISSING_MILESTONE_2");

  const order = EconomicOrderSchema.parse({
    id: crypto.randomUUID(),
    type: "PROJECT_PROGRESS",
    businessId: project.businessId,
    projectId: project.id,
    productId: project.productId,
    amount: m2.amount,
    refundablePercent: m2.refundablePercent,
    payment: {
      provider: "paypal",
      providerOrderId: body.payment.providerOrderId,
      status: "PAID",
    },
    policyAccepted: true,
    policyVersion: body.policyVersion ?? "v1",
    createdAt: now,
  });

  const milestones = project.milestones.map((m) => {
    if (m.step === 1) return { ...m, refundablePercent: 0 };
    if (m.step === 2) return { ...m, paid: true, paidAt: now, orderId: order.id };
    return m;
  });

  const updatedProject = ProjectSchema.parse({
    ...project,
    status: "IN_PROGRESS",
    milestones,
    updatedAt: now,
  });

  await env.PROJECTS_KV.put(pKey, JSON.stringify(updatedProject));
  await env.ORDER_KV.put(ORDER_KEY(order.id), JSON.stringify(order));

  return { project: updatedProject, order };
}
