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

import type { OpeningHoursFE } from
  "../../../../user/configurator/base_configuration/configuration/configurationSetup.store";

export interface SolutionConfiguratorSeedApiModel {
  id: string;

  descriptionTags: string[];
  serviceTags: string[];

  openingHours?: OpeningHoursFE;
}