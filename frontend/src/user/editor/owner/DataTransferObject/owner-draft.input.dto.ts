/* ======================================================
   INPUT DTO (FE → BE)
====================================================== */

export interface OwnerInputDTO {
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
      phoneNumber?: string;
    };
  
  }
  