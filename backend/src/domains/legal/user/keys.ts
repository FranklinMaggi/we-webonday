// ======================================================
// DOMAIN || USER || KV KEYS
// ======================================================
//
// RUOLO:
// - Centralizza tutte le chiavi KV del dominio User
// - Evita stringhe duplicate sparse nel codice
//
// INVARIANTI:
// - USER è l’Account (identity + legal)
// - Lookup primario sempre per userId
// ======================================================

/**
 * User entity (Account)
 * USER:{userId}
 */
export const USER_KEY = (userId: string) =>
    `USER:${userId}`;
  
  /**
   * Email → userId index
   * EMAIL:{email}
   */
  export const USER_EMAIL_INDEX = (email: string) =>
    `EMAIL:${email.toLowerCase()}`;
  
  /**
   * Auth provider → userId index
   * PROVIDER:{provider}:{providerUserId}
   */
  export const USER_PROVIDER_INDEX = (
    provider: string,
    providerUserId: string
  ) =>
    `PROVIDER:${provider}:${providerUserId}`;
  
  /**
   * (Opzionale / futuro)
   * Soft-delete marker
   */
  export const USER_DELETED_KEY = (userId: string) =>
    `USER:DELETED:${userId}`;