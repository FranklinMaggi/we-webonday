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
  status: "DRAFT" | "CONFIGURATION_IN_PROGRESS";
  solutionId: string;
  productId: string;
  businessName?: string;
  complete: boolean;
};

  