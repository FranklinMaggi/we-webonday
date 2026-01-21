// ======================================================
// BE || ConfigurationBaseReadDTO
// ======================================================
//
// RUOLO:
// - Output minimo per Dashboard / Configurator start
// - Usato subito dopo il login
//
// INVARIANTI:
// - Read only
// - Nessun dato sensibile
// ======================================================

export type ConfigurationBaseReadDTO = {
    id: string;
    status: "DRAFT" | "BUSINESS_READY";
    solutionId: string;
    productId: string;
    businessName?: string;  // da prefill
    businessDraftId?: string | null;
  
  };
  

  