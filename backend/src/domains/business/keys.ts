// @/domains/business/keys.ts
// ======================================================
// DOMAIN || BUSINESS || KV KEYS (CANONICAL)
// ======================================================
//
// REGOLE:
// - Tutte le entità Business sono OWNED da Configuration
// - Nessuna key per userId
// - configurationId = ID canonico
// ======================================================

/**
 * Draft del Business (fase configuratore)
 * ID === configurationId
 */
export const BUSINESS_DRAFT_KEY = (configurationId: string) =>
  `BUSINESS_DRAFT:${configurationId}`;

/**
 * Business finale (post-verifica)
 * ID === configurationId
 */
export const BUSINESS_KEY = (configurationId: string) =>
  `BUSINESS:${configurationId}`;