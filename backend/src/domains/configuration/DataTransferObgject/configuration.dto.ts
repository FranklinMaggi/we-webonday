import type { ConfigurationStatus } from "../mappers/configuration.status";

export type ConfigurationPublicDTO = {
  id: string;
  status: ConfigurationStatus;
  solutionId: string;
  productId: string;
};


