// ======================================================
// SHARED || DOMAIN || BUSINESS || READ TYPES (FE)
// ======================================================
//
// RUOLO:
// - DTO di LETTURA dal BE
// - Seed FE per configurazione
//
// NOTE:
// - NON usati in scrittura
// ======================================================

import type { OpeningHoursFE } from "./openingHours.types";


export type BusinessDraftReadDTO = {
  businessDraftId: string;
  businessName: string;
  openingHours: OpeningHoursFE | null;

  contact?: {
    mail?: string;
    phoneNumber?: string;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      zip?: string;
    };
  };

  privacy?: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };

  businessDescriptionTags?: string[];
  businessServiceTags?: string[];
};


export type SolutionSeed = {
    descriptionTags: string[];
    serviceTags: string[];
    openingHours: OpeningHoursFE | null;
  };
  