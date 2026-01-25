import type { OpeningHoursFE } from
  "@shared/domain/business/openingHours.types";

/**
 * ======================================================
 * FE || ConfigurationSetupDTO (CANONICAL)
 * ======================================================
 *
 * RUOLO:
 * - Stato FE completo del configurator
 * - DTO neutro (NO store, NO logica)
 *
 * SOURCE OF TRUTH:
 * - Backend → id / solutionId / productId / optionIds
 * - FE → resto
 * ======================================================
 */

export type ConfigurationSetupDTO = {
  /* ================= CORE ================= */
  configurationId?: string;
  businessDraftId?: string;

  solutionId: string;
  productId: string;
  optionIds: string[];

  /* ================= BUSINESS ================= */
  businessName: string;
  sector: string;

  email: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  zip?: string;

  openingHours: OpeningHoursFE;

  businessServiceTags: string[];
  businessDescriptionTags: string[];

  privacy: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };

  /* ================= OWNER ================= */
  ownerFirstName: string;
  ownerLastName: string;
  ownerBirthDate?: string;
  ownerSecondaryMail?: string;

  ownerPrivacy: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };

  /* ================= WORKSPACE ================= */
  layoutId?: string;
  style?: string;
  colorPreset?: string;

  visibility?: Record<string, boolean>;
};
