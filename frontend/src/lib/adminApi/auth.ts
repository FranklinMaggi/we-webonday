/**
 * Chiave unica per token admin
 * (sessionStorage, no cookie)
 */
/**
 * ======================================================
 * FE || src/lib/adminApi/auth.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - Gestione locale del token di autenticazione ADMIN
 *
 * RESPONSABILITÀ:
 * - Persistenza del token admin in sessionStorage
 * - Lettura sicura del token (null se assente o invalido)
 * - Cancellazione del token su logout forzato
 * - Redirect immediato alla pagina di login admin
 *
 * NON FA:
 * - NON effettua chiamate HTTP
 * - NON valida il token (backend source of truth)
 * - NON gestisce sessioni user
 * - NON interpreta permessi o ruoli
 *
 * RELAZIONE CON adminApi/client.ts:
 * - Questo file fornisce il token a adminFetch
 * - adminFetch decide quando forzare il logout
 * - auth.ts NON conosce gli endpoint
 *
 * SCELTE ARCHITETTURALI:
 * - sessionStorage (NON localStorage):
 *   • token limitato alla sessione browser
 *   • riduzione superficie di attacco
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/api/client.ts (sezione auth admin)
 * - Motivo:
 *   Consolidare tutta la gestione auth FE
 *   mantenendo separata la semantica admin
 *   rispetto all’utente standard.
 *
 * NOTE:
 * - Backend = source of truth
 * - Questo file NON deve crescere di scope
 * ======================================================
 */

const ADMIN_TOKEN_KEY = "ADMIN_TOKEN";

/**
 * Legge token admin
 */
export function getAdminToken(): string | null {
  const t = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  return t && t.trim().length > 0 ? t : null;
}

/**
 * Salva token admin
 */
export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token.trim());
}

/**
 * Rimuove token admin
 */
export function clearAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

/**
 * Logout forzato admin
 */
export function adminLogout(): never {
  clearAdminToken();
  window.location.href = "/admin/login";
  throw new Error("Admin logged out");
}
