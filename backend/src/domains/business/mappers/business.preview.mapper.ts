import type { BusinessPreviewDTO } from "@domains/site-preview/shcema/business-site.preview.schema";
import type { z } from "zod";

import { BusinessSchema } from "../schema/business.schema";
import { OwnerSchema } from "@domains/owner/schema/owner.schema";

export function mapBusinessPreview(
  businessDraft: z.infer<typeof BusinessSchema>,
  owner?: z.infer<typeof OwnerSchema>
): BusinessPreviewDTO {
  return {
    configurationId: businessDraft.configurationId,
    isDraft: true,

    businessName: businessDraft.businessName,

    address: businessDraft.address,
    contact: businessDraft.contact,
    openingHours: businessDraft.openingHours,

    descriptionTags: businessDraft.businessDescriptionTags ?? [],
    serviceTags: businessDraft.businessServiceTags ?? [],

    owner: owner
      ? {
          firstName: owner.firstName,
          lastName: owner.lastName,
        }
      : undefined,

    // ✅ allineato allo schema
    businessDataComplete: businessDraft.businessDataComplete,
  };
}
