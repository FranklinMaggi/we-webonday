/**
 * ======================================================
 * FE || ConfigurationDTO (GENERICA)
 * ======================================================
 *
 * RUOLO:
 * - Rappresentazione Configuration persistita (BE)
 *
 * USATA DA:
 * - liste
 * - workspace
 * - dashboard
 *
 * SOURCE OF TRUTH:
 * - Backend
 * ======================================================
 */
export type ConfigurationDTO = {
  id: string;
  status: "draft" | "preview" | "ordered";

  solutionId: string;
  optionIds: string[];

  createdAt?: string;
  updatedAt?: string;
};

/**
 * ======================================================
 * FE || ConfigurationConfiguratorDTO
 * ======================================================
 *
 * RUOLO:
 * - Payload BE per il configurator
 *
 * USATA ESCLUSIVAMENTE DA:
 * - /user/configurator/:id
 *
 * NOTE:
 * - MINIMA
 * - NO product
 * - NO data wizard
 * - NO rendering state
 * ======================================================
 */
export type ConfigurationConfiguratorDTO = {
  id: string;
  status: "draft" | "preview" | "ordered";

  solutionId: string;
  optionIds: string[];

  createdAt?: string;
  updatedAt?: string;
};
