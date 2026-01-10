// ======================================================
// BE || routes/projects/project.options.remove.ts
// CU: OPTION_REMOVE (Project)
// ======================================================
/* =========================================================
   AI_SUPERCOMMENT — PROJECT OPTION REMOVE
   =========================================================
   DOMINIO:
   - Rimozione option da Project
   - Operazione AUDIT, non economica

   SCELTA:
   - Nessun rimborso
   - Order creato a importo 0 (tracciabilità)

   NON FA:
   - NON tocca subscription esterne
   - NON ricalcola pricing

   KV:
   - PROJECTS_KV
   - ORDER_KV
========================================================= */

import type { Env } from "../../../types/env";
import { ProjectSchema } from "../../../domains/project/project.schema";
import { EconomicOrderSchema } from "../../../domains/order/order.economic.schema.ts";
import { PROJECTS_KEY, ORDER_KEY } from "../../../lib/kv";

type RemoveOptionBody = {
  businessId: string;
  projectId: string;
  optionId: string;
  policyVersion?: string;
};

export async function removeProjectOption(request: Request, env: Env) {
  let body: RemoveOptionBody;
  try {
    body = (await request.json()) as RemoveOptionBody;
  } catch {
    throw new Error("INVALID_JSON");
  }

  const now = new Date().toISOString();

  // 1) load project
  const pKey = PROJECTS_KEY(body.businessId, body.projectId);
  const rawProject = await env.PROJECTS_KV.get(pKey);
  if (!rawProject) throw new Error("PROJECT_NOT_FOUND");

  const project = ProjectSchema.parse(JSON.parse(rawProject));

  if (!project.optionIds.includes(body.optionId)) {
    throw new Error("OPTION_NOT_ACTIVE_ON_PROJECT");
  }

  // 2) update project
  const updatedProject = ProjectSchema.parse({
    ...project,
    optionIds: project.optionIds.filter((id) => id !== body.optionId),
    updatedAt: now,
  });

  // 3) audit order (no rimborso)
  const order = EconomicOrderSchema.parse({
    id: crypto.randomUUID(),
    type: "OPTION_REMOVE",
    businessId: project.businessId,
    projectId: project.id,
    productId: project.productId,
    optionIds: [body.optionId],
    amount: 0,
    payment: {
      provider: "paypal",
      providerOrderId: "NO_PAYMENT_REQUIRED",
      status: "PAID",
    },
    policyAccepted: true,
    policyVersion: body.policyVersion ?? "v1",
    createdAt: now,
  });

  // 4) persist
  await env.PROJECTS_KV.put(pKey, JSON.stringify(updatedProject));
  await env.ORDER_KV.put(ORDER_KEY(order.id), JSON.stringify(order));

  return { project: updatedProject, order };
}
