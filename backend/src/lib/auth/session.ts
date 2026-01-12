/**
 * ======================================================
 * SESSION — USER AUTH (HARD)
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Gestire ESCLUSIVAMENTE la sessione utente autenticata
 *
 * SOURCE OF TRUTH:
 * - Cookie: webonday_session
 * - KV: ON_USERS_KV
 *
 * INVARIANTI:
 * - webonday_session contiene SOLO userId
 * - Se il cookie è presente ma l’utente non esiste → sessione invalida
 * - Tutti gli endpoint protetti DEVONO usare requireUser()
 *
 * NON FA:
 * - NON gestisce visitor
 * - NON crea sessioni anonime
 * - NON fa fallback automatici
 *
 * PERCHÉ:
 * - Separare HARD AUTH (user) da SOFT SESSION (visitor)
 * - Evitare sessioni fantasma
 * - Rendere l’autenticazione auditabile
 *
 * NOTA CRITICA:
 * - Qualsiasi flusso visitor NON deve MAI passare da questo file
 * ======================================================
 */
/**
 * NOTA ARCHITETTURALE (INVARIANTE):
 *
 * - Questo file gestisce SOLO l’autenticazione HARD (user loggato)
 * - NON rappresenta l’identità applicativa globale
 * - NON conosce visitor, device, o sessioni soft
 *
 * L’identità applicativa (visitor / user / device)
 * è intenzionalmente ESTERNA a questo modulo.
 *
 * Questo consente:
 * - multi-device corretto
 * - persistenza visitor indipendente dal login
 * - assenza di side-effect post-login
 */

import type { Env } from "../../types/env";

export function buildSessionCookie(
    env: Env,
    userId: string
  ) {
    const isLocal = env.FRONTEND_URL.startsWith("http://localhost");
  
    return [
      `webonday_session=${userId}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=None",
      "Domain=.webonday.it",
      "Max-Age=2592000",
    ].join("; ");
  }
  
/**
 * LOW LEVEL — legge solo il cookie
 */
export function getUserIdFromSession(
  request: Request
): string | null {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(/webonday_session=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * MID LEVEL — carica user dal KV
 *//**
 * ⚠️ ATTENZIONE
 * Questa funzione NON è una guard.
 * NON usare per endpoint protetti.
 * Usare requireUser() per HARD-AUTH.
 */
export async function getUserFromSession(
  request: Request,
  env: Env
): Promise<any | null> {
  const userId = getUserIdFromSession(request);
  if (!userId) return null;

  const raw = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!raw) return null;

  return JSON.parse(raw);
}

/**
 * ======================================================
 * HARD AUTH GUARD
 * ======================================================
 *
 * ⚠️ USARE SOLO PER:
 * - checkout
 * - orders
 * - business
 * - configurazioni user-owned
 *
 * ❌ NON USARE PER:
 * - cart
 * - configuration-from-cart
 * - browsing pubblico
 *
 * PERCHÉ:
 * - Blocca esplicitamente i visitor
 * - Evita side-effect impliciti
 * ======================================================
 */

export async function requireUser(
  request: Request,
  env: Env
): Promise<{ userId: string; user: any } | null> {
  const userId = getUserIdFromSession(request);
  if (!userId) return null;

  const raw = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!raw) return null;

  return { userId, user: JSON.parse(raw) };
}
export function destroySessionCookie(env: Env) {
  return [
    "webonday_session=",
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=None",
    "Domain=.webonday.it",
    "Max-Age=0",
  ].join("; ");
}
