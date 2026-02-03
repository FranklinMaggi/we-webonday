/* ======================================================
   INPUT DTO (FE → BE)
====================================================== */

export interface OwnerDraftInputDTO {
    firstName?: string;
    lastName?: string;
    birthDate?: string; // ISO yyyy-mm-dd
  
    address?: {
      street?: string;
      city?: string;
      number?:string; 
      province?: string;
      zip?: string;
      country?: string;
    };
  
    contact?: {
      secondaryMail?: string;
      phoneNumber?: string;
    };
  
    source?: "google" | "manual";
  }
  