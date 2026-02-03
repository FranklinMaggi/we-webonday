// ======================================================
// SHARED || DOMAIN || BUSINESS || READ TYPES (FE)
// ======================================================
//
// RUOLO:
// - DTO di LETTURA dal BE
// - Seed FE per configurazione
//
// NOTE:
// - READ ONLY
// - NON usato in scrittura
// - Allineato 1:1 con BusinessDraftSchema (BE)
// ======================================================

import type { OpeningHoursFE } from "./openingHours.types";

/* ======================================================
   BUSINESS DRAFT — READ DTO
====================================================== */

export type BusinessDraftReadDTO = {
  businessDraftId: string;

  businessName: string;

  /* DOMAIN */
  openingHours: OpeningHoursFE | null;

  /* CONTACT (MINIMO) */
  contact?: {
    mail?: string;
    phoneNumber?: string;
    pec?: string;
  };

  /* ADDRESS (TOP LEVEL — CANONICAL) */
  address?: {
    street?: string;
    number?: string;
    city?: string;
    province?: string;
    zip?: string;
  };

  /* PRIVACY */
  privacy?: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };

  /* CLASSIFICATION */
  businessDescriptionTags?: string[];
  businessServiceTags?: string[];
};

/* ======================================================
   SOLUTION SEED (READ ONLY)
====================================================== */

export type SolutionSeed = {
  descriptionTags: string[];
  serviceTags: string[];
  openingHours: OpeningHoursFE | null;
};
