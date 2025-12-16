const CONSENT_KEY = "webonday_cookie_consent_v1";
const CONSENT_VERSION = "1.0.0";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: string;
  updatedAt: string;
};

export function getLocalConsent(): CookieConsent | null {
  const raw = localStorage.getItem(CONSENT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function saveLocalConsent(input: {
  analytics: boolean;
  marketing: boolean;
}) {
  const consent: CookieConsent = {
    necessary: true,
    analytics: input.analytics,
    marketing: input.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  return consent;
}

/* =========================
   Helper di comodo
========================= */

export function hasAnalyticsConsent(): boolean {
  return getLocalConsent()?.analytics === true;
}

export function hasMarketingConsent(): boolean {
  return getLocalConsent()?.marketing === true;
}

export function hasAnyConsent(): boolean {
  return getLocalConsent() !== null;
}

export function clearLocalConsent() {
  localStorage.removeItem(CONSENT_KEY);
}
