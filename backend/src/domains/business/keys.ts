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


export const BUSINESS_KEY = (configurationId: string) =>
  `BUSINESS:${configurationId}`;