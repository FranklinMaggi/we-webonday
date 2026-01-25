// ======================================================
// BE || DTO || BusinessDraftBaseReadDTO (READ)
// ======================================================
//
// RUOLO:
// - DTO READ per BusinessDraft
// - Usato per:
//   • Prefill Step Business (FE)
//   • Sync stato BE → FE
//
// SOURCE OF TRUTH:
// - BusinessDraftSchema (DOMAIN)
// ======================================================

import type { OpeningHoursDTO } from "@domains/business/schema/business.schema";
// ⬆️ oppure importa dal punto canonico dove è definito

export type BusinessDraftBaseReadDTO = {
  businessDraftId: string;

  businessName: string;
  solutionId: string;
  productId: string;

  /* =====================
     DOMAIN — CANONICAL
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
     STATUS
  ====================== */
  verified: false;
};
