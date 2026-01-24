/**
 * AI-SUPERCOMMENT — COOKIE BANNER
 *
 * RUOLO:
 * - Raccogliere consenso cookie lato FE
 *
 * INVARIANTI:
 * - NON usa visitorId
 * - NON usa userId
 * - NON persiste stato lato backend
 *
 * MOTIVO:
 * - Consenso = evento GDPR, non identità
 * - Backend salva solo statistiche aggregate
 */
// src/components/cookie/CookieBanner.tsx

import { useEffect, useState } from "react";
import {
  getLocalConsent,
  saveLocalConsent,
} from "../utils/cookieConsent";
import { acceptCookies } from "../lib/api";

/**
 * CookieBanner
 * - Mostrato solo se NON esiste consenso locale
 * - Salva consenso in localStorage
 * - Invia consenso al backend (COOKIES_KV)
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     CHECK INIZIALE
  ========================= */
  useEffect(() => {
    const consent = getLocalConsent();
    if (!consent) setVisible(true);
  }, []);

  /* =========================
     SYNC BACKEND
  ========================= */
  async function syncBackend(
    analytics: boolean,
    marketing: boolean
  ) {
    try {
      setLoading(true);

     
      await acceptCookies(
       
        analytics,
        marketing
        
      );
    } catch (err) {
      console.error("[CookieBanner] sync error:", err);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     HANDLERS
  ========================= */
  async function handleAcceptAll() {
    saveLocalConsent({
      analytics: true,
      marketing: true,
    });

    await syncBackend(true, true);
    setVisible(false);
  }

  async function handleRejectAll() {
    saveLocalConsent({
      analytics: false,
      marketing: false,
    });

    await syncBackend(false, false);
    setVisible(false);
  }

  if (!visible) return null;

  /* =========================
     RENDER
  ========================= */
  return (
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
        boxShadow: "0 -4px 16px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ maxWidth: "70%" }}>
        <strong>Cookie WebOnDay</strong>
        <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Utilizziamo cookie tecnici necessari e, previo consenso,
          cookie analitici e marketing per migliorare l’esperienza.
          Puoi modificare le preferenze in qualsiasi momento.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          disabled={loading}
          onClick={handleRejectAll}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 999,
            border: "1px solid #555",
            background: "#222",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Solo necessari
        </button>

        <button
          disabled={loading}
          onClick={handleAcceptAll}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 999,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Accetta tutti
        </button>
      </div>
    </div>
  );
}
