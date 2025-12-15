// src/components/cookie/CookieBanner.tsx
import { useEffect, useState } from "react";
import { getOrCreateVisitorId } from "../../utils/visitor";
import { acceptCookies } from "../../lib/api";
import {
  getLocalConsent,
  saveLocalConsent,
} from "../../utils/cookieConsent";
import type { LocalConsent } from "../../utils/cookieConsent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const consent = getLocalConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  async function sendConsentToBackend(consent: LocalConsent) {
    const visitorId = getOrCreateVisitorId();
  
    try {
      setLoading(true);
      await acceptCookies(
        visitorId,
        consent.analytics,
        consent.marketing
      );
    } catch (err) {
      console.error("Errore salvataggio consenso cookie:", err);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleAcceptAll() {
    const consent: LocalConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };

    saveLocalConsent(consent);
    await sendConsentToBackend(consent);
    setVisible(false);
  }

  async function handleRejectAll() {
    const consent: LocalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };

    saveLocalConsent(consent);
    await sendConsentToBackend(consent);
    setVisible(false);
  }

  if (!visible) return null;


return visible ? (
  <div
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "1rem",
      background: "#111",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      gap: "1rem",
      zIndex: 9999,
      boxShadow: "0 -4px 16px rgba(0,0,0,0.25)"
    }}
  >
    <div style={{ maxWidth: "70%" }}>
      <strong>Cookie WebOnDay</strong>
      <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
        Usiamo cookie tecnici e, previo tuo consenso, cookie di analisi e marketing per
        migliorare la tua esperienza. Puoi modificare le tue preferenze in qualsiasi momento.
      </p>
    </div>

    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <button
        disabled={loading}
        onClick={handleRejectAll}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "999px",
          border: "1px solid #555",
          background: "#222",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Solo necessari
      </button>

      <button
        disabled={loading}
        onClick={handleAcceptAll}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "999px",
          border: "1px solid transparent",
          background: "#4f46e5",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Accetta tutti
      </button>
    </div>
  </div>
) : null;

}
