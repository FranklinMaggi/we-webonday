// ======================================================
// SHARED || DOMAIN || CONFIGURATION || SET FIELD TYPE
// ======================================================
//
// RUOLO:
// - Tipo canonico per setField
// - Usato da componenti FE che operano su ConfigurationSetupDTO
//
// ======================================================

import type { ConfigurationSetupDTO } from "@src/user/editor/api/type/configurator/configurationSetup.types";

export type ConfigurationSetField =
  <K extends keyof ConfigurationSetupDTO>(
    key: K,
    value: ConfigurationSetupDTO[K]
  ) => void;
