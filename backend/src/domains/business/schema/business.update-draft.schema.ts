// ======================================================
// DOMAIN || BUSINESS || UPDATE DRAFT.schema.ts
// ======================================================
//
// RUOLO:
// - Input canonico per UPDATE BusinessDraft
// - Usato da POST /api/business/update-draft
//
// INVARIANTI:
// - Tutti i campi opzionali (PATCH-like)
// - verified NON modificabile
// - commercial origin NON modificabile
//
// ======================================================

import { z } from "zod";
import { BusinessContactSchema } from "./business.contact.schema";


export const UpdateBusinessDraftSchema = z.object({
  /* ---------- Identity ---------- */
  businessDraftId: z.string().optional(),
  configurationId: z.string().min(1).optional(),

  /* ---------- Editable fields ---------- */
  businessName: z.string().min(1).optional(),

  businessOpeningHour: z
    .record(z.unknown())
    .optional(),

  contact: BusinessContactSchema,
complete:z.boolean(),
  businessDescriptionTags: z.array(z.string()).optional(),
  businessServiceTags: z.array(z.string()).optional(),
})
.refine(
  (data) => data.businessDraftId || data.configurationId,
  {
    message:
      "Either businessDraftId or configurationId is required",
  }
);

export type UpdateBusinessDraftDTO = z.infer<
  typeof UpdateBusinessDraftSchema
>;
