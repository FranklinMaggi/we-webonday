/** configuration Key , userConfigurations Key */

import { Env } from "../../types/env";

import { ConfigurationDTO } from "./configuration.schema";
/* =========================
   KV KEYS
========================= */
export function configurationKey(id: string) {
    return `CONFIGURATION:${id}`;
  }
  
  export function userConfigurationsKey(userId: string) {
    return `USER_CONFIGURATIONS:${userId}`;
  }
  
  /* =========================
   HELPERS
========================= */
export async function getConfiguration(env: Env, id: string) {
    const raw = await env.CONFIGURATION_KV.get(configurationKey(id));
    return raw ? (JSON.parse(raw) as ConfigurationDTO) : null;
  }
  