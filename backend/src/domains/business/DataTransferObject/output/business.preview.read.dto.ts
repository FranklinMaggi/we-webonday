// ======================================================
// BE || DTO || BusinessPreviewReadDTO (CANONICAL)
// ======================================================
//
// RUOLO:
// - DTO UNICO per Site Preview
// - Usato dal Workspace FE
// - Derivato da BusinessDraft (FASE 1)
//
// INVARIANTI:
// - NO layout
// - NO palette
// - SOLO contenuto
// - Tollerante (draft incompleti)
// ======================================================

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

  businessDescriptionTags?: string[];
  businessServiceTags?: string[];
};