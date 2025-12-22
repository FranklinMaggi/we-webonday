// backend/src/lib/auth/types.ts

/**
 * Provider di autenticazione supportati
 */
export type AuthProvider =
  | "password"
  | "google";

/**
 * Identità normalizzata dell’utente
 * (input interno all’auth pipeline)
 *
 * ⚠️ NON è salvata in KV
 * ⚠️ NON è esposta al frontend
 * ⚠️ NON è validata runtime
 */
export interface AuthIdentity {
  provider: AuthProvider;

  /**
   * ID univoco del provider
   * - password: email o hash
   * - google: sub
   */
  providerUserId: string;

  /** email normalizzata (lowercase) */
  email: string;

  /** true se il provider garantisce la verifica */
  emailVerified: boolean;

  /** Dati profilo opzionali */
  profile?: {
    name?: string;
    givenName?: string;
    familyName?: string;
    picture?: string;
    locale?: string;
  };
}
