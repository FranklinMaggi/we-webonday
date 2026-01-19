// DOMAIN || BUSINESS || BASE.schema.ts
import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";

export const BusinessBaseSchema = z.object({
  /* ---------- Identity ---------- */
  id: z.string().uuid(),

  /* ---------- Core ---------- */
  businessName: z.string().min(1),

  /* ---------- Commercial origin (IMMUTABILE) ---------- */
  solutionId: z.string().min(1),
  productId: z.string().min(1),

  /* ---------- Opening hours (raw) ---------- */
  businessOpeningHour: z.record(z.unknown()),

  /* ---------- Ownership ---------- */
  businessOwner: z.object({
    personId: z.string(),
  }),

  /* ---------- Contact ---------- */
  contact: ContactSchema.extend({
    pec: z.string().email().optional(),
  }),

  /* ---------- Classification ---------- */
  businessDescriptionTags: z.array(z.string()).default([]),
  businessServiceTags: z.array(z.string()).default([]),

  /* ---------- Verification ---------- */
  verified: z.literal(false),
});

export type BusinessBaseDTO = z.infer<typeof BusinessBaseSchema>;
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


