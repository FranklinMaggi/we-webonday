// @/domains/business/keys.ts
// ======================================================
// DOMAIN || BUSINESS || KV KEYS (PACK)
// ======================================================
//
// RUOLO:
// - Single source of truth per tutte le chiavi KV business
// - Vietato definire chiavi inline nei file
//
// USO:
// import { BUSINESS_DRAFT_KEY } from "../keys";
// ======================================================

export const BUSINESS_DRAFT_KEY = (configurationId: string) =>
    `BUSINESS_DRAFT:${configurationId}`;
  
  export const BUSINESS_KEY = (businessId: string) =>
    `BUSINESS:${businessId}`;
  
  export const BUSINESS_OWNER_DRAFT_KEY = (userId: string) =>
    `BUSINESS_OWNER_DRAFT:${userId}`;// @/domains/business/keys.ts
