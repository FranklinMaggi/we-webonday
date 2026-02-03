// ======================================================
// FE || CONFIGURATION || READ DTO
// ======================================================
//
// RUOLO:
// - Stato di avanzamento verifica
// - SOURCE OF TRUTH per ProfileView
//
// ======================================================

export type ConfigurationReadDTO = {
    id: string;
  
    status:
      | "CONFIGURATION_IN_PROGRESS"
      | "BUSINESS_READY"
      | "CONFIGURATION_READY"
      | "ACCEPTED"
      | "REJECTED";
  
    ownerVerified: boolean;
    businessVerified: boolean;
  
    createdAt: string;
    updatedAt: string;
  };
  