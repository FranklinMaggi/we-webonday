import type { ContactDTO } from "@domains/GeneralSchema/contact.schema";
import type { AddressDTO } from "@domains/GeneralSchema/address.schema";

// domains/owner/DataTransferObject/output/owner.draft.read.dto.ts

export type OwnerReadDTO = {
  id: string;
  userId:string; 
  firstName: string;
  lastName: string;
  birthDate?: string;

  contact?: ContactDTO

  address?: AddressDTO


  source?: "google" | "manual";    
  /** 🔑 SOURCE OF TRUTH */
  
  verification: "DRAFT" |"PENDING" | "ACCEPTED" | "REJECTED";    


};