export type ConfigurationUserSummaryDTO = {
  id: string;

  solutionId: string;
  productId: string;
  optionIds?: string[];

  status?: string;
  dataComplete: boolean;
  createdAt?: string;
  updatedAt?: string;

  // UX-only (titoli, card, sidebar)
  businessName?: string;

  prefill?: {
    businessName?: string;
  };

  display?: {
    businessName?: string;
  };
};