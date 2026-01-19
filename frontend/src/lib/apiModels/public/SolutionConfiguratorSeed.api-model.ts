// ======================================================
// FE || SolutionConfiguratorSeedApiModel
// ======================================================
//
// RUOLO:
// - DTO pubblico Solution per CONFIGURATOR
// - READ ONLY
//
// USATO DA:
// - StepBusinessInfo
//
// SOURCE:
// - Backend Solution_KV (subset pubblico)
//
// ======================================================

export interface SolutionConfiguratorSeedApiModel {
    id: string;
  
    descriptionTags: string[];
    serviceTags: string[];
  
    openingHoursDefault?: Record<string, string>;
  }
  