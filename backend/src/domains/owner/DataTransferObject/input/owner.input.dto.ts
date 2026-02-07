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
import { ContactDTO } from "@domains/GeneralSchema/contact.schema";

export interface OwnerInputDTO {
  /* Identity */
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  /*source*/
  source?: "google" | "manual";
  /* Address */
  address?: AddressDTO;
  /* Contact */
  contact?: ContactDTO
  
  
}
