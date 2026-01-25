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

import { type OpeningHoursFE } from "../../../configuration/configurationSetup.store";
// ⬆️ oppure importa dal punto canonico dove è definito

export type BusinessDraftBaseReadDTO = {
  businessDraftId: string;

  businessName: string;
  solutionId: string;
  productId: string;

  /* =====================
     DOMAIN — CANONICAL
  ====================== */
  openingHours: OpeningHoursFE;

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
