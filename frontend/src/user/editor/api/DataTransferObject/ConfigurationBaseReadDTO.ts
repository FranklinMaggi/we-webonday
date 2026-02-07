// ConfigurationBaseReadDTO — READ BASE (CANONICAL)
export type ConfigurationBaseReadDTO = {
    id: string;
    solutionId: string;
    productId: string;
    businessName?: string;
    status: string;
    dataComplete: boolean;
  };