// ======================================================
// DOMAIN || ProjectSchema — ONE-TIME PROJECT EXECUTION
// ======================================================
//
// SCOPO:
// - Rappresentare l’esecuzione reale di un progetto one-time
// - Gestire stato e milestone (NON pagamenti)
//
// NON È:
// - un prodotto
// - un ordine
// - una subscription
//
// Project = contenitore operativo + contrattuale
// ======================================================

import { z } from "zod";

/* =========================
   MILESTONE
========================= */
export const ProjectMilestoneSchema = z.object({
  step: z.union([z.literal(1), z.literal(2), z.literal(3)]),

  label: z.string().min(1),          // es: "Avvio progetto"
  amount: z.number().nonnegative(),  // importo tranche

  refundablePercent: z
    .number()
    .min(0)
    .max(100),                       // 50 | 25 | 0

  paid: z.boolean(),

  // riferimento all’Order che ha saldato la milestone
  orderId: z.string().optional(),
  paidAt: z.string().datetime().optional(),
});

/* =========================
   PROJECT
========================= */
export const ProjectSchema = z.object({
    id: z.string().min(3), // 👈 ora è projectKey (slug)
  
    productId: z.string().min(1),
    businessId: z.string().min(1),
  
    status: z.enum([
      "STARTED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ]),
  
    milestones: z.array(ProjectMilestoneSchema).length(3),
  
    optionIds: z.array(z.string()).default([]),
  
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  });
  

export type Project = z.infer<typeof ProjectSchema>;
