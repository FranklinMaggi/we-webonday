
import type { OpeningHoursDTO } from
  "@domains/GeneralSchema/hours.opening.schema";

export type BusinessPreviewReadDTO = {
  /** 
   * ID canonico
   * = configurationId
   */
  configurationId: string;

  /**
   * True finché la preview è basata su Draft
   * (FASE 1 → sempre true)
   */
  isDraft: true;

  /* =========================
     CONTENUTO BUSINESS
  ========================= */

  businessName?: string;

  contact?: {
    phoneNumber?: string;
    mail?: string;
  };

  address?: {
    street?: string;
    city?: string;
    province?: string;
  };

  openingHours?: OpeningHoursDTO;
  businessDescriptionText?: string;
  businessDescriptionTags?: string[];
  businessServiceTags?: string[];
};