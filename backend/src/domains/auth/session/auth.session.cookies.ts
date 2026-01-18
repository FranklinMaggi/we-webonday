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
import { emitAuthLifecycleEvent } from "@domains/auth";

export function buildSessionCookie(
    env: Env,
    userId: string ,
    request?: Request
  ) {
    const origin = request?.headers.get("Origin") ?? "";
  const referer = request?.headers.get("Referer") ?? "";
  const isCrossSite =
  origin.startsWith("http://localhost") ||
  !origin.endsWith("webonday.it");

  const cookie = [
    `webonday_session=${userId}`,
    "Path=/",
    "HttpOnly",
    "Secure",                 // 🔒 OBBLIGATORIO
    "SameSite=None",          // 🔥 OBBLIGATORIO cross-site
    "Domain=.webonday.it",
    "Max-Age=2592000",
  ].join("; ");

 
   
    emitAuthLifecycleEvent({
      event: "SESSION_CREATED",
      userId,
      source: "route",
    });
  return cookie;

}

export function destroySessionCookie(
  env: Env , 
request?: Request) {


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



