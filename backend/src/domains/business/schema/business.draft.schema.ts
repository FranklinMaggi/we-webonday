//be/..../business.draft.schema.ts


import { z } from "zod";
import { BusinessContactSchema } from "./business.contact.schema";

export const BusinessDraftSchema = z.object({
  /* ---------- Identity ---------- */
  id: z.string().min(1),
  configurationId: z.string().min(1),
  userId: z.string(),
  /* ---------- Core ---------- */
  businessName: z.string().min(1),

  /* ---------- Commercial origin (IMMUTABILE) ---------- */
  solutionId: z.string().min(1),
  productId: z.string().min(1),

  /* ---------- Opening hours (raw) ---------- */
  businessOpeningHour: z.record(z.unknown()),


  /* ---------- Contact ---------- */
  contact: BusinessContactSchema,

  /* ---------- Classification ---------- */
  businessDescriptionTags: z.array(z.string()).default([]),
  businessServiceTags: z.array(z.string()).default([]),
  privacy: z.object({
    accepted: z.boolean(),
    acceptedAt: z.string(),
    policyVersion: z.string(),
  }),
  /* ---------- Verification ---------- */

  verified: z.literal(false),
  createdAt:z.string().datetime(),
  updatedAt:z.string().datetime(),
  complete: z.boolean().default(false),
});

export type BusinessDraftDTO = z.infer<typeof BusinessDraftSchema>;
// ======================================================
// DOMAIN || BUSINESS || CREATE-SCHEDA.schema.ts
// ======================================================
//
// RUOLO:
// - Input canonico per POST /business/create-schede
// - Usato da:
//   • Frontend (FASE 1)
//   • Backend route
//
// INVARIANTI:
// - Nessun campo editoriale
// - Nessun media
// - Nessun status
// - Nessun ownerUserId
// ======================================================


