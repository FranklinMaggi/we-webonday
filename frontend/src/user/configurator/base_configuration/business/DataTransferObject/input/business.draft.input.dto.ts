/* ======================================================
   DOMAIN || BUSINESS || DRAFT INPUT DTO (CANONICAL)
======================================================

RUOLO:
- DTO canonico per CREAZIONE / UPDATE BusinessDraft
- Usato da:
  - FE (BusinessForm)
  - POST /api/business/create-draft
  - POST /api/business/update-draft

INVARIANTI:
- Dominio = TimeRange (NO stringhe, NO legacy)
- businessDraftId NON richiesto in create
- Backend = source of truth
====================================================== */

import type { OpeningHoursDTO } from "@domains/business/schema/business.schema";

export interface BusinessDraftInputDTO {
  /* =====================
     LINKAGE
  ====================== */
  configurationId: string;

  /* =====================
     CORE
  ====================== */
  businessName: string;
  solutionId: string;
  productId: string;

  /* =====================
     DOMAIN (CANONICAL)
  ====================== */
  openingHours: OpeningHoursDTO;

  /* =====================
     CONTACT
  ====================== */
  contact: {
    address?: {
      street?: string;
      city?: string;
      province?: string;
      zip?: string;
    };
    phoneNumber?: string;
    mail: string;
    pec?: string;
  };

  /* =====================
     CLASSIFICATION
  ====================== */
  businessDescriptionTags: string[];
  businessServiceTags: string[];

  /* =====================
     STATUS (INVARIANT)
  ====================== */
  verified: false;
}
