// src/utils/cookieConsent.ts
const VISITOR_ID_KEY = "webonday_visitor_id";
const CONSENT_KEY = "webonday_cookie_consent_v1";

export type LocalConsent = {
  analytics: boolean;
  marketing: boolean;
  necessary: boolean;
};

export function getOrCreateVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    // Usa crypto.randomUUID se disponibile
    id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export function getLocalConsent(): LocalConsent | null {
  const raw = localStorage.getItem(CONSENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalConsent;
  } catch {
    return null;
  }
}

export function saveLocalConsent(consent: LocalConsent) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}
