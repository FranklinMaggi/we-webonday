import type { ContactDTO } from "@domains/GeneralSchema/contact.schema";
import type { AddressDTO } from "@domains/GeneralSchema/address.schema";

export interface OwnerDraftReadDTO {
  configurationId:string ; 
  id: string;

  firstName?: string;
  lastName?: string;
  birthDate?: string;

  address?: AddressDTO;

  contact?: ContactDTO & {
    secondaryMail?: string;
    phone?: string;
  };


  source: "google" | "manual";
  verification: "PENDING" | "ACCEPTED" | "REJECTED";
  complete: boolean;
}
