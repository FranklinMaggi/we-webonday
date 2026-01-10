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
  