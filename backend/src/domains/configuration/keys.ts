// ======================================================
// BE || DOMAIN || CONFIGURATION || KV KEYS
// ======================================================
//
// RUOLO:
// - Single source of truth per tutte le chiavi KV Configuration
//
// INVARIANTI:
// - Nessuna chiave inline nei domini
// - Tutte le chiavi passano da qui
// ======================================================

// @domains/configuration/keys.ts
export const CONFIGURATION_KEY = (id: string) =>
  `CONFIGURATION:${id}`;

export const USER_CONFIGURATIONS_KEY = (userId: string) =>
  `USER_CONFIGURATIONS:${userId}`;

// @domains/business/keys.ts
export const BUSINESS_DRAFT_KEY = (configurationId: string) =>
  `BUSINESS_DRAFT:${configurationId}`;

export const BUSINESS_KEY = (businessId: string) =>
  `BUSINESS:${businessId}`;

// @domains/owner/keys.ts
export const OWNER_DRAFT_KEY = (configurationId: string) =>
  `OWNER_DRAFT:${configurationId}`;