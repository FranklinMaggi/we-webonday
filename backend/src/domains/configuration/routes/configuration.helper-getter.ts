// ======================================================
// BE || DOMAIN || CONFIGURATION || GET CONFIGURATION
// ======================================================
//
// RUOLO:
// - Helper di lettura Configuration da KV
// - Usata da routes e altri domini
//
// INVARIANTI:
// - Read-only
// - Nessuna mutazione
// - Backend = source of truth
// ======================================================

import type { Env } from "types/env";
import type { ConfigurationDTO } from "../schema/configuration.schema";
import { CONFIGURATION_KEY } from "../keys";

export async function getConfiguration(
  env: Env,
  configurationId: string
): Promise<ConfigurationDTO | null> {
  const configuration =
    (await env.CONFIGURATION_KV.get(
      CONFIGURATION_KEY(configurationId),
      "json"
    )) as ConfigurationDTO | null;

  return configuration;
}