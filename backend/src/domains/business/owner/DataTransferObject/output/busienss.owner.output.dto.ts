// ======================================================
// DOMAIN || BUSINESS || OWNER || GET DTO
// ======================================================
//
// RUOLO:
// - Output BE → FE per recupero OwnerDraft
// - Usato da GET /api/user/business-owner
//
// NOTE:
// - Può essere undefined se non esiste
// ======================================================

import { PrivacyAcceptanceDTO } from "@domains/configuration/schema/privacy.acceptance.schema";
import type { ContactDTO } from "@domains/GeneralSchema/contact.schema";

export interface OwnerUserGetDTO {
  id: string; // userId

  firstName?: string;
  lastName?: string;
  birthDate?: string;

  contact?: ContactDTO & {
    secondaryMail?: string;
  };

  source: "google" | "manual";
  verified: boolean;
  complete: boolean; 
}
// owner.draft.read.dto.ts


// owner.draft.read.dto.ts
export interface OwnerDraftReadDTO {
  id: string;

  firstName?: string;
  lastName?: string;
  birthDate?: string;

  contact?: ContactDTO & {
    secondaryMail?: string;
  };
privacy?:PrivacyAcceptanceDTO;
  source: "google" | "manual";
  verified: boolean;
  complete: boolean;
}

