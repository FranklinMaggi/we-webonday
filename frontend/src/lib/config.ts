// ======================================================
// FE || src/lib/config.ts
// ======================================================
//
// CONFIG — API BASE (FE)
// ------------------------------------------------------
// RUOLO:
// - Fornire API_BASE al client FE
//
// INVARIANTE ARCHITETTURALE:
// - Backend = source of truth
// - FE NON gestisce sicurezza, cookie o CORS
//
// DEV MODE:
// - Auth funziona via cookie cross-site
// - Gestito dal backend (SameSite / Secure)
//
// ======================================================

const FALLBACK_API_BASE = "https://api.webonday.it";

/**
 * API base URL
 *
 * - VITE_API_BASE → build-time (DEV / preview)
 * - fallback → produzione stabile
 */
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? FALLBACK_API_BASE;
