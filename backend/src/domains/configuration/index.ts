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
  CONFIGURATION_STATUS,
  ConfigurationSchema,
} from "./schema/configuration.schema";

export type {
  ConfigurationStatus,
  ConfigurationDTO,
} from "./schema/configuration.schema";

/* ======================================================
   KV KEYS + READ HELPERS
====================================================== */
export {
  configurationKey,
  userConfigurationsKey,
  getConfiguration,
} from "./configuration.keys";

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
   ROUTES — BUSINESS ↔ CONFIGURATION BRIDGE
====================================================== */
export {
  upsertConfigurationFromBusiness,
} from "./routes/configuration.business.write";

/* ======================================================
   ROUTES — ADMIN
====================================================== */
export {
  listAllConfigurations,
} from "./routes/configuration.admin.read";
