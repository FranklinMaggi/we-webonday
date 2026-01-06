// ======================================================
// BE || routes/projects/project.options.add.ts
// CU: OPTION_ADD (Project)
// ======================================================
/* =========================================================
   AI_SUPERCOMMENT — PROJECT OPTION ADD
   =========================================================
   DOMINIO:
   - Attivazione option su Project
   - SOLO option recurring monthly

   PERCHÉ:
   - Le option vivono SUL PROJECT, non sul product

   NON FA:
   - NON modifica il product
   - NON gestisce trial
   - NON gestisce downgrade automatici

   KV:
   - PROJECTS_KV
   - OPTIONS_KV
   - ORDER_KV

   ERRORI INTENZIONALI:
   - OPTION_NOT_ACTIVE
   - OPTION_ALREADY_ACTIVE
   - OPTION_NOT_MONTHLY_RECURRING
========================================================= */

import type { Env } from "../../types/env";
import { ProjectSchema } from "../../schemas/core/projectSchema";
import { OptionSchema } from "../../schemas/core/optionSchema";
import { EconomicOrderSchema } from "../../schemas/orders/economicOrderSchema";
import { PROJECTS_KEY, ORDER_KEY, OPTIONS_KEY  } from "../../lib/kv";

type AddOptionBody = {
  businessId: string;
  projectId: string;
  optionId: string;
  payment: { providerOrderId: string };
  policyVersion?: string;
};

export async function addProjectOption(request: Request, env: Env) {
  let body: AddOptionBody;
  try {
    body = (await request.json()) as AddOptionBody;
  } catch {
    throw new Error("INVALID_JSON");
  }

  const now = new Date().toISOString();

  // 1) load project
  const pKey = PROJECTS_KEY(body.businessId, body.projectId);
  const rawProject = await env.PROJECTS_KV.get(pKey);
  if (!rawProject) throw new Error("PROJECT_NOT_FOUND");

  const project = ProjectSchema.parse(JSON.parse(rawProject));
 
  if (project.status === "CANCELLED") {
    throw new Error("PROJECT_CANCELLED");// NOTE:
    // Project COMPLETED può ricevere option ricorrenti (manutenzione / servizi post-go-live)
  }
  // 2) load option
  const rawOpt = await env.OPTIONS_KV.get(OPTIONS_KEY(body.optionId));
  if (!rawOpt) throw new Error(`OPTION_NOT_FOUND:${body.optionId}`);

  const option = OptionSchema.parse(JSON.parse(rawOpt));

  if (option.status !== "ACTIVE") throw new Error(`OPTION_NOT_ACTIVE:${option.id}`);

  // recurring monthly only
  if (option.payment.mode !== "recurring" || option.payment.interval !== "monthly") {
    throw new Error("OPTION_NOT_MONTHLY_RECURRING");
  }

  if (project.optionIds.includes(option.id)) {
    throw new Error("OPTION_ALREADY_ACTIVE");
  }

  // 3) update project
  const updatedProject = ProjectSchema.parse({
    ...project,
    optionIds: [...project.optionIds, option.id],
    updatedAt: now,
  });

  // 4) order
  const order = EconomicOrderSchema.parse({
    id: crypto.randomUUID(),
    type: "OPTION_ADD",
    businessId: project.businessId,
    projectId: project.id,
    productId: project.productId,
    optionIds: [option.id],
    amount: option.price,
    payment: {
      provider: "paypal",
      providerOrderId: body.payment.providerOrderId,
      status: "PAID",
    },
    policyAccepted: true,
    policyVersion: body.policyVersion ?? "v1",
    createdAt: now,
  });

  // 5) persist
  await env.PROJECTS_KV.put(pKey, JSON.stringify(updatedProject));
  await env.ORDER_KV.put(ORDER_KEY(order.id), JSON.stringify(order));

  return { project: updatedProject, order };
}
