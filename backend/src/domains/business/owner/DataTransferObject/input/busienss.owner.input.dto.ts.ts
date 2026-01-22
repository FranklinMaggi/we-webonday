// ======================================================
// DOMAIN || BUSINESS || OWNER || INPUT DTO
// ======================================================
//
// RUOLO:
// - Input FE → BE per OwnerDraft
//
// INVARIANTI:
// - NO id
// - NO verified
// - businessId obbligatorio
// ======================================================

import type { ContactDTO } from "@domains/GeneralSchema/contact.schema";
import type {PrivacyAcceptanceDTO} from "@domains/configuration/schema/privacy.acceptance.schema"

export interface BusinessOwnerDraftInputDTO {
  firstName?: string;
  lastName?: string;
  birthDate?: string; // ISO yyyy-mm-dd
  source?:string; 
  contact?: {
    secondaryMail?: string;
  };
  privacy?:PrivacyAcceptanceDTO;

}

type OwnerFormState = {
  firstName: string;        // obbligatorio
  lastName: string;         // obbligatorio
  birthDate?: string;       // opzionale
  secondaryMail?: string;   // opzionale
};
