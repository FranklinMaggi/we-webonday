// src/utils/visitor.ts

const VISITOR_ID_KEY = "webonday_visitor_id";

/**
 * Restituisce un visitorId stabile e persistente nel browser.
 * Evita rigenerazioni accidentali, assicura compatibilità universale.
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  let id = window.localStorage.getItem(VISITOR_ID_KEY);

  // Se esiste già ed è valido → lo usiamo
  if (id && id.startsWith("visitor_")) {
    return id;
  }

  // Compatibilità universale: se crypto.randomUUID non è disponibile
  const newId = "visitor_" + (crypto.randomUUID?.() ?? generateFallbackId());

  window.localStorage.setItem(VISITOR_ID_KEY, newId);

  return newId;
}

// Fallback per Safari vecchi o env speciali
function generateFallbackId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
