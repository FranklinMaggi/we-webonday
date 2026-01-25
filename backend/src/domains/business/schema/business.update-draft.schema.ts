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
import { OpeningHoursSchema } from "./business.schema";
export const UpdateBusinessDraftSchema = z.object({
  businessDraftId: z.string(),

  businessName: z.string().optional(),

  openingHours: OpeningHoursSchema.optional(),

  contact: z
    .object({
      mail: z.string().email(),
      phoneNumber: z.string().optional(),
      pec: z.string().optional(),
      address: z
        .object({
          street: z.string().optional(),
          city: z.string().optional(),
          province: z.string().optional(),
          zip: z.string().optional(),
        })
        .optional(),
    })
    .optional(),

  businessDescriptionTags: z.array(z.string()).optional(),
  businessServiceTags: z.array(z.string()).optional(),
});
