/* AI-SUPERCOMMENT
 * FILE: backend/src/schemas/core/solutionSchema.ts
 *
 * UPDATE STEP 2:
 * - Aggiunta relazione dichiarativa Solution → Product
 *
 * PERCHE:
 * - Funnel guidato
 * - Controllo marketing
 * - Nessuna logica implicita
 */

import { z } from "zod";

export const SolutionSchema = z.object({
  id: z.string().min(1),                  // "food"
  name: z.string().min(1),                // "Ristoranti & Food"
  description: z.string().min(1),         // hero / intro
  longDescription: z.string().optional(), // pagina dettaglio
  icon: z.string().optional(),

  industries: z.array(z.string()),  // ["restaurant","bar"]

  imageKey:z.string().optional(),

  productIds: z.array(z.string()).default([]),
  // es: ["essential", "worker", "pro"]

  status: z.enum(["DRAFT","ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  createdAt: z.string().datetime(),
});

export type Solution = z.infer<typeof SolutionSchema>;
