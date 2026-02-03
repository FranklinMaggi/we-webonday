// ======================================================
// DOMAIN || BUSINESS || PREVIEW MAPPER
// ======================================================
//
// RUOLO:
// - Converte BusinessDraft (+ OwnerDraft) in PreviewDTO
// - Nessuna validazione forte
// - Tollerante a draft incompleti
// ======================================================

import type { BusinessPreviewDTO } from "@domains/site-preview/shcema/business-site.preview.schema";
import type { z } from "zod";
import { BusinessDraftSchema } from
  "../schema/business.draft.schema";
import { OwnerDraftSchema } from
  "@domains/owner/schema/owner.draft.schema";

export function mapBusinessPreview(
  businessDraft: z.infer<typeof BusinessDraftSchema>,
  ownerDraft?: z.infer<typeof OwnerDraftSchema>
): BusinessPreviewDTO {
  return {
    configurationId: businessDraft.configurationId,
    isDraft: true,

    businessName: businessDraft.businessName,

    address: businessDraft.address,
    contact: businessDraft.contact,

    openingHours: businessDraft.openingHours,

    descriptionTags:
      businessDraft.businessDescriptionTags ?? [],

    serviceTags:
      businessDraft.businessServiceTags ?? [],

    owner: ownerDraft
      ? {
          firstName: ownerDraft.firstName,
          lastName: ownerDraft.lastName,
        }
      : undefined,

    complete: businessDraft.complete,
  };
}