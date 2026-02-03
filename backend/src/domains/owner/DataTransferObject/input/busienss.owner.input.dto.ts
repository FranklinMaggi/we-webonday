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
import type { AddressDTO } from "@domains/GeneralSchema/address.schema";

export interface BusinessOwnerDraftInputDTO {
  configurationId:string; 
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  source?: "google" | "manual";

  address?: AddressDTO;

  contact?: {
    secondaryMail?: string;
    phone?: string;
  };

}
