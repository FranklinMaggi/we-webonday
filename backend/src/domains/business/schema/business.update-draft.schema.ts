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
// DEPRECATO 
// ======================================================
// ======================================================
// DOMAIN || BUSINESS || UPDATE DRAFT.schema.ts
// ======================================================
//
// RUOLO:
// - Input canonico per UPDATE BusinessDraft (PATCH-like)
// - Usato da POST /api/business/update-draft
//
// INVARIANTI:
// - Tutti i campi opzionali
// - Nessun vincolo di business finale
// - verified NON modificabile
// - commercial origin NON modificabile
// ======================================================

import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";

export const UpdateBusinessDraftSchema = z.object({
  /* Identity */
  businessDraftId: z.string(),

  /* Core */
  businessName: z.string().optional(),

  /* Domain */
  openingHours: OpeningHoursSchema.optional(),

  /* ✅ CONTACT (canonical, permissivo) */
  contact: ContactSchema.optional(),

  /* ✅ ADDRESS (separato, opzionale) */
  address: AddressSchema.optional(),

  /* Classification */
  businessDescriptionTags: z.array(z.string()).optional(),
  businessServiceTags: z.array(z.string()).optional(),
});
