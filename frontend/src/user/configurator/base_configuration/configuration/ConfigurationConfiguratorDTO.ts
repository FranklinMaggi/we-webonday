
export type ConfigurationConfiguratorDTO = {
  id: string;

  solutionId: string;
  productId: string;
  optionIds?: string[];

  status?: string;

  createdAt?: string;
  updatedAt?: string;

  // opzionale: prefill UX
  prefill?: {
    businessName?: string;
  };
};