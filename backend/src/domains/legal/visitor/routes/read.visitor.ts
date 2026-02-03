// src/utils/visitor.ts



/**
 * Restituisce un visitorId stabile e persistente nel browser.
 * Evita rigenerazioni accidentali, assicura compatibilità universale.
 */

export function getVisitorIdFromCookie(): string | null {
  return document.cookie
    .split("; ")
    .find(c => c.startsWith("webonday_visitor="))
    ?.split("=")[1] ?? null;
}

