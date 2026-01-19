// ======================================================
// FE || ConfigurationConfiguratorDTO
// ======================================================
//
// RUOLO:
// - DTO MINIMO allineato al BE
// - Usato SOLO dal configurator
//
// ======================================================

export type ConfigurationConfiguratorDTO = {
  id: string;

  solutionId: string;
  productId: string;

  options: string[];

  prefill?: {
    businessName: string;
  };

  status: string;

  createdAt?: string;
  updatedAt?: string;
};
