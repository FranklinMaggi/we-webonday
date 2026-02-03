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
// INVARIANTE:
// - ❌ NO logica runtime
// - ✅ SOLO re-export
// ======================================================

/* ======================================================
   SCHEMA + TYPES
====================================================== */
export {

  ConfigurationSchema,
} from "./schema/configuration.schema";

export type {

  ConfigurationDTO,
} from "./schema/configuration.schema";

/* ======================================================
   KV KEYS + READ HELPERS
====================================================== */
export {
  configurationKey,
  userConfigurationsKey,
  getConfiguration,
} from "./keys.ts";

/* ======================================================
   FACTORY / ID
====================================================== */
export {
  slugify,
  buildConfigurationId,
} from "./configuration.factory";

/* ======================================================
   DTO (FE OUTPUT)
====================================================== */
export type {
  ConfigurationPublicDTO,
} from "./DataTransferObgject/configuration.dto";

/* ======================================================
   ROUTES — USER
====================================================== */
export {
  listUserConfigurations,
  getUserConfiguration,
} from "./routes/configuration.read";

export {
  deleteUserConfiguration,
} from "./routes/configuration.user.delete";

/* ======================================================
   ROUTES — BASE (BOOTSTRAP)
====================================================== */
export {
  createConfigurationBase,
} from "./routes/configuration.base.write";

/* ======================================================
   ROUTES — ADMIN
====================================================== */
export {
  listAllConfigurations,
} from "./routes/configuration.admin.read";
