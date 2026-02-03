// ======================================================
// SHARED || DOMAIN || OWNER || READ TYPES (FE)
// ======================================================
//
// RUOLO:
// - DTO di sola lettura per OwnerDraft
// - Mirror fedele del dominio BE
//
// INVARIANTI:
// - Nessuna logica
// - Nessun default
// - Tutti i campi opzionali come da BE
// ======================================================

export type OwnerDraftReadDTO = {
  /* ================= ID ================= */
  id: string;
  configurationId?:string; 
  /* ================= ANAGRAFICA ================= */
  firstName?: string;
  lastName?: string;
  birthDate?: string;

  address?: {
    street?: string;
    number?:string; 
    city?: string;
    province?: string;
    region?:string; 
    zip?: string;
    country?: string;
  };

  /* ================= CONTATTI ================= */
  contact?: {
    secondaryMail?: string;
    phoneNumber?: string;
  };

  /* ================= PRIVACY ================= */
  privacy?: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };

  /* ================= META ================= */
  source?: "google" | "manual";
  verified?: boolean;
  complete: boolean;
};
