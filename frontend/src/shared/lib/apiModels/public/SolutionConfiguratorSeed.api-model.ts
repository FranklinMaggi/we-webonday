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

import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";
export interface SolutionConfiguratorSeedApiModel {
  id: string;

  descriptionTags: string[];
  serviceTags: string[];

  openingHours?: OpeningHoursFE;
}