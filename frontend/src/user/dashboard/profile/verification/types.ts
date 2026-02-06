// ======================================================
// SHARED || DOMAIN || CONFIGURATION || SET FIELD TYPE
// ======================================================
//
// RUOLO:
// - Tipo canonico per setField
// - Usato da componenti FE che operano su ConfigurationSetupDTO
//
// ======================================================

import type { ConfigurationSetupDTO } from "@src/shared/domain/user/configurator/configurationSetup.types";

export type ConfigurationSetField =
  <K extends keyof ConfigurationSetupDTO>(
    key: K,
    value: ConfigurationSetupDTO[K]
  ) => void;
