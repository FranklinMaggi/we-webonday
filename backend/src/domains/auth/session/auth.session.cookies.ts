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
 * - Tutti gli endpoint protetti DEVONO usare requireAuthUser()
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

import type { Env } from "../../../types/env";

export function buildSessionCookie(
    env: Env,
    userId: string
  ) {
    const isLocal = env.FRONTEND_URL.startsWith("http://localhost");
  
    return [
      `webonday_session=${userId}`,
      "Path=/",
      "HttpOnly",
      isLocal ? "" : "Secure",
      isLocal ? "SameSite=Lax" : "SameSite=None",
      isLocal ? "" : "Domain=.webonday.it",
      "Max-Age=2592000",
    ].join("; ");
  }
  


export function destroySessionCookie(env: Env) {
  const isLocal = env.FRONTEND_URL.startsWith("http://localhost");
  
  return [
    "webonday_session=",
    "Path=/",
    "HttpOnly",
    isLocal ? "" : "Secure",
    isLocal ? "SameSite=Lax" : "SameSite=None",
    isLocal ? "" : "Domain=.webonday.it",
    "Max-Age=0",
  ].join("; ");
}



