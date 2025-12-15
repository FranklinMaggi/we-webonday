// src/utils/cookieConsent.ts
const CONSENT_KEY = "webonday_cookie_consent_v1";

export type LocalConsent = {
  analytics: boolean;
  marketing: boolean;
  necessary: boolean;
};

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
