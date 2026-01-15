/**
 * ======================================================
 * FE || ConfigurationApiModel
 * ======================================================
 *
 * RUOLO:
 * - Shape dati Configuration proveniente dal backend
 *
 * USATO DA:
 * - userApi (configuration)
 * - normalizer FE
 *
 * ORIGINE:
 * - Backend (source of truth)
 *
 * NOTE:
 * - NON è stato FE
 * - NON contiene dati di rendering
 * ======================================================
 */

export type ConfigurationDTO = {
    id: string;
    status: "draft" | "preview" | "ordered";
  
    solutionId: string;
  
    business?: {
      name?: string;
      type?: string;
      city?: string;
      email?: string;
      phone?: string;
      description?: string;
    };
  
    createdAt?: string;
    updatedAt?: string;
  };
  
  
  /**
 * ======================================================
 * CONFIGURATION — CONFIGURATOR DTO (FE)
 * ======================================================
 *
 * USO ESCLUSIVO:
 * - /user/configurator/:id
 *
 * SOURCE OF TRUTH:
 * - Backend (endpoint dedicato)
 *
 * NON USARE:
 * - per liste
 * - per workspace
 * ======================================================
 */

export type ConfigurationConfiguratorDTO = {
  id: string;
  status: "draft" | "preview" | "ordered";

  /* CORE */
  solutionId: string;
  productId?: string;
  optionIds?: string[];

  /* BUSINESS TAGS */
  businessDescriptionTags?: string[];
  businessServiceTags?: string[];

  /* WIZARD DATA */
  data?: Record<string, unknown>;

  createdAt?: string;
  updatedAt?: string;
};
