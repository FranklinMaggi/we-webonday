
// domains/owner/DataTransferObject/output/owner.draft.read.dto.ts

export type OwnerDraftReadDTO = {
  id: string;

  firstName: string;
  lastName: string;
  birthDate?: string;

  contact?: {
    secondaryMail?: string;
    phoneNumber?: string;
  };

  address?: {
    street?: string;
    number?: string;
    city?: string;
    province?: string;
    region?: string;
    zip?: string;
    country?: string;
  };


source :"google"|"manual";    
  /** 🔑 SOURCE OF TRUTH */
    ownerDraftComplete: boolean;
  
    verification: "DRAFT" |"PENDING" | "ACCEPTED" | "REJECTED";    

   
};