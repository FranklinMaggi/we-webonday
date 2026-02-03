// ======================================================
// BE || DOMAIN || AUTH || KV KEYS
// ======================================================
//
// RUOLO:
// - Single Source of Truth per TUTTE le chiavi KV AUTH
//
// INVARIANTI:
// - ❌ Vietate stringhe inline "USER:${id}"
// - ❌ Vietato usare prefissi hardcoded
// - ✅ Tutte le chiavi AUTH passano da qui
//
// KV COINVOLTI:
// - ON_USERS_KV
// ======================================================

/* ======================================================
   USER (ENTITY)
====================================================== */

/**
 * Utente applicativo
 * KV: ON_USERS_KV
 */
export const AUTH_USER_KEY = (userId: string) =>
    `USER:${userId}`;
  
  /* ======================================================
     USER INDEXES
  ====================================================== */
  
  /**
   * Lookup userId da email normalizzata
   */
  export const AUTH_USER_EMAIL_INDEX = (email: string) =>
    `USER_EMAIL:${email.toLowerCase()}`;
  
  /**
   * Lookup userId da provider identity
   * es: PROVIDER:google:123456
   */
  export const AUTH_USER_PROVIDER_INDEX = (
    provider: string,
    providerUserId: string
  ) =>
    `PROVIDER:${provider}:${providerUserId}`;