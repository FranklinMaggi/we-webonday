// ======================================================
// SHARED || DOMAIN || OWNER || READ TYPES (FE)
// ======================================================

export type OwnerDraftReadDTO = {
    id:string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    contact?: {
      secondaryMail?: string;
    };
    privacy?: {
      accepted: boolean;
      acceptedAt: string;
      policyVersion: string;
    };
    source?:string; 
    verified?:boolean; 
    complete: boolean;
  };
  