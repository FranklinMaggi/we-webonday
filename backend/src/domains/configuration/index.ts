// ======================================================
// BE || domains/configuration/index.ts
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION DOMAIN BARREL (CANONICAL)
//
// RUOLO:
// - Punto di export unico del dominio Configuration
// - Evita import frammentati nei routes
//
// CONTENUTO:
// - Schema Zod + types (ConfigurationSchema, ConfigurationDTO, status)
// - KV keys + helper read (configurationKey, userConfigurationsKey, getConfiguration)
// - Factory helpers (slugify, buildConfigurationId)
// - DTO output per FE (ConfigurationPublicDTO)
//
// INVARIANTE:
// - Questo file NON deve contenere logica runtime
// - Solo re-export (barrel)
//
// ======================================================

export {
    CONFIGURATION_STATUS,
    ConfigurationSchema,
  } from "./configuration.schema";
  
  export type {
    ConfigurationStatus,
    ConfigurationDTO,
  } from "./configuration.schema";
  
  export {
    configurationKey,
    userConfigurationsKey,
    getConfiguration,
  } from "./configuration.keys";
  
  export {
    slugify,
    buildConfigurationId,
  } from "./configuration.factory";
  
  export type {
    ConfigurationPublicDTO,
  } from "./configuration.dto";
  