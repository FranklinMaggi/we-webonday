// src/utils/visitor.ts



/**
 * Restituisce un visitorId stabile e persistente nel browser.
 * Evita rigenerazioni accidentali, assicura compatibilità universale.
 */
const KEY = "webonday_visitor_id";

export function getOrCreateVisitorId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = "visitor_" + crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}


