// ======================================================
// FE || marketing/components/legal/LegalGate.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Punto UFFICIALE di visualizzazione e accettazione policy
// - Gate legale prima della creazione user
//
// INVARIANTI:
// - Visitor only
// - Policy DEVONO essere visualizzate
// - Accettazione ESPLICITA e separata
// - UI copy SOLO via t()
//
// NON FA:
// - NON crea user
// - NON chiama login
// - NON crea sessioni
//
// ======================================================

import { useState } from "react";
import { t } from "@shared/aiTranslateGenerator";
import { PolicyView } from "../PolicyViewer";  

type LegalAcceptanceState = {
  cookie: boolean;
  privacy: boolean;
  terms: boolean;
};

export function LegalGate({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const [accepted, setAccepted] = useState<LegalAcceptanceState>({
    cookie: false,
    privacy: false,
    terms: false,
  });

  function toggle(key: keyof LegalAcceptanceState) {
    setAccepted((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  const allAccepted =
    accepted.cookie &&
    accepted.privacy &&
    accepted.terms;

  return (
    <section
      aria-labelledby="legal-gate-title"
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      {/* ================= HEADER ================= */}
      <header style={{ marginBottom: 32 }}>
        <h1 id="legal-gate-title">
          {t("legal.gate.title")}
        </h1>
        <p style={{ opacity: 0.7 }}>
          {t("legal.gate.subtitle")}
        </p>
      </header>

      {/* ================= COOKIE POLICY ================= */}
      <section style={{ marginBottom: 40 }}>
        <PolicyView type="cookie" scope="general" />

        <label style={{ display: "block", marginTop: 16 }}>
          <input
            type="checkbox"
            checked={accepted.cookie}
            onChange={() => toggle("cookie")}
          />{" "}
          {t("legal.gate.accept_cookie")}
        </label>
      </section>

      {/* ================= PRIVACY POLICY ================= */}
      <section style={{ marginBottom: 40 }}>
        <PolicyView type="privacy" scope="general" />

        <label style={{ display: "block", marginTop: 16 }}>
          <input
            type="checkbox"
            checked={accepted.privacy}
            onChange={() => toggle("privacy")}
          />{" "}
          {t("legal.gate.accept_privacy")}
        </label>
      </section>

      {/* ================= TERMS ================= */}
      <section style={{ marginBottom: 40 }}>
        <PolicyView type="terms" scope="general" />

        <label style={{ display: "block", marginTop: 16 }}>
          <input
            type="checkbox"
            checked={accepted.terms}
            onChange={() => toggle("terms")}
          />{" "}
          {t("legal.gate.accept_terms")}
        </label>
      </section>

      {/* ================= ACTION ================= */}
      <footer style={{ marginTop: 48 }}>
        <button
          type="button"
          disabled={!allAccepted}
          onClick={onContinue}
        >
          {t("legal.gate.continue")}
        </button>
      </footer>
    </section>
  );
}