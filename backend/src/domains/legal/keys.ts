// ======================================================
// DOMAIN || LEGAL || KV KEYS
// ======================================================
// Single Source of Truth per il dominio LEGAL
// ======================================================

  /* =========================
     USER LEGAL STATE
     KV: ON_USERS_KV
  ========================= */
  
  /** Stato legale aggregato dell’utente */
  export const USER_LEGAL_STATE_KEY = (userId: string) =>
    `USER:LEGAL:${userId}`;
  
  /** Accettazione singola policy (append-only) */
  export const USER_POLICY_ACCEPTANCE_KEY = (
    userId: string,
    version: string
  ) =>
    `USER:POLICY_ACCEPTANCE:${userId}:${version}`;
  
  
  /* =========================
     LEGAL AUDIT LOG
     KV: USER_LEGAL_LOG_KV
  ========================= */
  
  export const USER_LEGAL_LOG_KEY = (
    userId: string,
    eventId: string
  ) =>
    `USER:LEGAL_LOG:${userId}:${eventId}`;