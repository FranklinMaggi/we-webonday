// @/domains/configuration/mappers/configuration.status.ts
// ======================================================
// DOMAIN || CONFIGURATION || STATUS (PACK)
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Source of Truth ASSOLUTA per lo stato di Configuration
// - Definisce:
//   • stati ammessi
//   • semantica funzionale (capabilities)
//
// INVARIANTI:
// - Nessun accesso KV
// - Nessuna logica HTTP
// - Nessuna dipendenza da FE
//
// REGOLA:
// - Vietato definire status altrove
// ======================================================

export const CONFIGURATION_STATUS = [
  "DRAFT",
  "CONFIGURATION_IN_PROGRESS",
  "CONFIGURATION_READY",
  "ACCEPTED",
  "REJECTED",
  "BUSINESS_READY",
] as const;

export type ConfigurationStatus =
  typeof CONFIGURATION_STATUS[number];

/* ======================================================
   CAPABILITIES (SEMANTICA)
====================================================== */

export type ConfigurationCapabilities = {
  canEdit: boolean;
  canOpenConfigurator: boolean;
  canSubmit: boolean;
  canPreview: boolean;
  canHaveBusiness: boolean;
  visibleInUserDashboard: boolean;
  visibleAsBusiness: boolean;
};

export const CONFIGURATION_CAPABILITIES: Record<
  ConfigurationStatus,
  ConfigurationCapabilities
> = {
  DRAFT: {
    canEdit: true,
    canOpenConfigurator: true,
    canSubmit: false,
    canPreview: false,
    canHaveBusiness: false,
    visibleInUserDashboard: true,
    visibleAsBusiness: false,
  },

  CONFIGURATION_IN_PROGRESS: {
    canEdit: true,
    canOpenConfigurator: true,
    canSubmit: true,
    canPreview: false,
    canHaveBusiness: false,
    visibleInUserDashboard: true,
    visibleAsBusiness: false,
  },

  CONFIGURATION_READY: {
    canEdit: false,
    canOpenConfigurator: false,
    canSubmit: false,
    canPreview: true,
    canHaveBusiness: false,
    visibleInUserDashboard: true,
    visibleAsBusiness: false,
  },

  ACCEPTED: {
    canEdit: false,
    canOpenConfigurator: false,
    canSubmit: false,
    canPreview: true,
    canHaveBusiness: true,
    visibleInUserDashboard: true,
    visibleAsBusiness: false,
  },

  REJECTED: {
    canEdit: false,
    canOpenConfigurator: false,
    canSubmit: false,
    canPreview: true,
    canHaveBusiness: false,
    visibleInUserDashboard: true,
    visibleAsBusiness: false,
  },

  BUSINESS_READY: {
    canEdit: false,
    canOpenConfigurator: false,
    canSubmit: false,
    canPreview: true,
    canHaveBusiness: true,
    visibleInUserDashboard: true,
    visibleAsBusiness: true,
  },
};

/* ======================================================
   HELPERS
====================================================== */

export function getConfigurationCapabilities(
  status: ConfigurationStatus
): ConfigurationCapabilities {
  return CONFIGURATION_CAPABILITIES[status];
}

export function isBusinessVisibleFromConfiguration(
  status: ConfigurationStatus
): boolean {
  return CONFIGURATION_CAPABILITIES[status].visibleAsBusiness;
}