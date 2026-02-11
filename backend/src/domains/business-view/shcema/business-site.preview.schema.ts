// ======================================================
// DOMAIN || SITE PREVIEW || BUSINESS PREVIEW DTO
// ======================================================

import type { OpeningHoursDTO } from
  "@domains/GeneralSchema/hours.opening.schema";
import type { AddressDTO } from
  "@domains/GeneralSchema/address.schema";
import type { ContactDTO } from
  "@domains/GeneralSchema/contact.schema";

export type BusinessViewDTO = {
  configurationId: string;
  isDraft: true;

  businessName?: string;

  address?: AddressDTO;

  contact?: ContactDTO;

  openingHours?: OpeningHoursDTO;

  descriptionTags?: string[];
  serviceTags?: string[];

  owner?: {
    firstName?: string;
    lastName?: string;
  };

  businessDataComplete: boolean;
};