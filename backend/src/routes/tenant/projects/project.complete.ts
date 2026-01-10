// ======================================================
// BE || routes/projects/project.complete.ts
// CU-4: PROJECT_COMPLETE (Milestone 3)
// ======================================================
/* =========================================================
   AI_SUPERCOMMENT — PROJECT COMPLETE (CU-4)
   =========================================================
   DOMINIO:
   - Chiusura progetto (Milestone 3)
   - Stato finale: COMPLETED

   PRECONDIZIONI:
   - Milestone 2 pagata
   - Project IN_PROGRESS
   - Project NON cancellato

   NON FA:
   - NON crea subscription
   - NON gestisce post-delivery
   - NON rimborsa

   KV:
   - PROJECTS_KV
   - ORDER_KV

   ERRORI INTENZIONALI:
   - PROJECT_INVALID_STATE
   - MILESTONE_2_NOT_PAID
========================================================= */

import type { Env } from "../../../types/env";
import { ProjectSchema, Project } from "../../../domains/project/project.schema";
import { EconomicOrderSchema } from "../../../domains/order/order.economic.schema.ts";
    import { PROJECTS_KEY, ORDER_KEY } from "../../../lib/kv";

/* =========================
   GUARDS
========================= */
function assertCanComplete(project: Project) {
    const m2 = project.milestones.find((m) => m.step === 2);
    const m3 = project.milestones.find((m) => m.step === 3);
  
    if (project.status === "CANCELLED") {
      throw new Error("PROJECT_CANCELLED");
    }
  
    if (project.status !== "IN_PROGRESS") {
      throw new Error("PROJECT_INVALID_STATE");
    }
  
    if (!m2 || !m2.paid) {
      throw new Error("MILESTONE_2_NOT_PAID");
    }
  
    if (!m3 || m3.paid) {
      throw new Error("MILESTONE_3_INVALID_STATE");
    }
  }
  

type CompleteBody = {
  businessId: string;
  projectId: string;
  payment: { providerOrderId: string };
  policyVersion?: string;
};

export async function completeProject(request: Request, env: Env) {
  let body: CompleteBody;
  try {
    body = await request.json();
  } catch {
    throw new Error("INVALID_JSON");
  }

  const now = new Date().toISOString();

  // 1️⃣ load project
  const pKey = PROJECTS_KEY(body.businessId, body.projectId);
  const raw = await env.PROJECTS_KV.get(pKey);
  if (!raw) throw new Error("PROJECT_NOT_FOUND");

  const project = ProjectSchema.parse(JSON.parse(raw));

  // 2️⃣ guard
  assertCanComplete(project);

  const m3 = project.milestones.find((m) => m.step === 3);
  if (!m3) throw new Error("MISSING_MILESTONE_3");

  // 3️⃣ order milestone 3
  const order = EconomicOrderSchema.parse({
    id: crypto.randomUUID(),
    type: "PROJECT_COMPLETE",
    businessId: project.businessId,
    projectId: project.id,
    productId: project.productId,
    amount: m3.amount,
    refundablePercent: 0,
    payment: {
      provider: "paypal",
      providerOrderId: body.payment.providerOrderId,
      status: "PAID",
    },
    policyAccepted: true,
    policyVersion: body.policyVersion ?? "v1",
    createdAt: now,
  });

  // 4️⃣ update project
  const milestones = project.milestones.map((m) =>
    m.step === 3
      ? { ...m, paid: true, paidAt: now, orderId: order.id }
      : m
  );

  const updatedProject = ProjectSchema.parse({
    ...project,
    status: "COMPLETED",
    milestones,
    updatedAt: now,
  });

  // 5️⃣ persist
  await env.PROJECTS_KV.put(pKey, JSON.stringify(updatedProject));
  await env.ORDER_KV.put(ORDER_KEY(order.id), JSON.stringify(order));

  return { project: updatedProject, order };
}
