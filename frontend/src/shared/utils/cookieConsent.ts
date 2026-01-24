// src/utils/cookieConsent.ts

const CONSENT_KEY = "webonday_cookie_consent_v1";

export type LocalConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: string;
  updatedAt: string;
};

/**
 * Legge il consenso locale (localStorage)
 */
export function getLocalConsent(): LocalConsent | null {
  const raw = localStorage.getItem(CONSENT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LocalConsent;
  } catch {
    return null;
  }
}

/**
 * Salva il consenso locale (NON ritorna nulla)
 */
export function saveLocalConsent(params: {
  analytics: boolean;
  marketing: boolean;
}) {
  const payload: LocalConsent = {
    necessary: true,
    analytics: params.analytics,
    marketing: params.marketing,
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
}

/* =========================
   Helpers opzionali
========================= */

export function hasAnalyticsConsent() {
  return getLocalConsent()?.analytics === true;
}

export function hasMarketingConsent() {
  return getLocalConsent()?.marketing === true;
}

export function clearLocalConsent() {
  localStorage.removeItem(CONSENT_KEY);
}
