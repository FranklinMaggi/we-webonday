// ======================================================
// FE || lib/dto/configurationDTO.ts
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION DTO
//
// RUOLO:
// - Contratto FE per entità Configuration
//
// SOURCE:
// - Backend /api/configuration
//
// ======================================================

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
  