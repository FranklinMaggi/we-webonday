import { useEffect, useState } from "react";
import {
  getLocalConsent,
  saveLocalConsent,
} from "../../utils/cookieConsent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const consent = getLocalConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  async function notifyBackend(payload: {
    analytics: boolean;
    marketing: boolean;
  }) {
    try {
      setLoading(true);
      await fetch("/api/cookies/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          analytics: payload.analytics,
          marketing: payload.marketing,
        }),
      });
    } catch (err) {
      console.error("Errore invio consenso cookie:", err);
    } finally {
      setLoading(false);
    }
  }
  async function handleAcceptAll() {
    const consent = saveLocalConsent({
      analytics: true,
      marketing: true,
    });

    await notifyBackend({
    
      analytics: consent.analytics,
      marketing: consent.marketing,
    });

    setVisible(false);
  }

  async function handleRejectAll() {
    const consent = saveLocalConsent({
      analytics: false,
      marketing: false,
    });

    await notifyBackend({
     
      analytics: consent.analytics,
      marketing: consent.marketing,
    });

    setVisible(false);
  }

  if (!visible) return null;

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
            borderRadius: "999px",
            border: "1px solid transparent",
            background: "#4f46e5",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Accetta tutti
        </button>
      </div>
    </div>
  );
}
