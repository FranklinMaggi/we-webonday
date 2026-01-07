// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// AI-SUPERCOMMENT — STEP BUSINESS INFO
//
// RUOLO:
// - Primo step del wizard di configurazione
// - Raccolta dati anagrafici dell’attività
// - Selezione del settore (industry)
//
// SOURCE OF TRUTH:
// - industries → Solution (backend)
//
// INVARIANTI:
// - Nessuna fetch
// - Nessuna persistenza
// - Solo lettura/scrittura store FE
//
// NOTE ARCHITETTURALI:
// - Questo step ACCETTA dati parziali
// - Non assume MAI che la configurazione sia completa
// ======================================================

import { useEffect } from "react";
import { useConfigurationSetupStore } from "../configurationSetup.store";

/* =========================
   PROPS
========================= */
type StepBusinessInfoProps = {
  onNext: () => void;
  industries: string[];

  /**
   * Snapshot opzionale proveniente da:
   * - configurazione esistente
   * - post-cart
   * - restore sessione
   */
  configuration?: {
    business?: {
      name?: string;
      type?: string;
      city?: string;
      email?: string;
      phone?: string;
    };
  };
};

export default function StepBusinessInfo({
  onNext,
  configuration,
  industries,
}: StepBusinessInfoProps) {
  const { data, setField } = useConfigurationSetupStore();

  /* ======================================================
     PREFILL (IDEMPOTENTE)
     PERCHE:
     - UX migliore post-login / post-cart
     - NON sovrascrive input manuale
  ====================================================== */
  useEffect(() => {
    if (!configuration?.business) return;

    if (!data.businessName && configuration.business.name) {
      setField("businessName", configuration.business.name);
    }

    const legacyType = configuration.business.type
      ?.trim()
      .toLowerCase();

    if (!data.sector && legacyType && industries.includes(legacyType)) {
      setField("sector", legacyType);
    }

    if (!data.city && configuration.business.city) {
      setField("city", configuration.business.city);
    }

    if (!data.email && configuration.business.email) {
      setField("email", configuration.business.email);
    }

    if (!data.phone && configuration.business.phone) {
      setField("phone", configuration.business.phone);
    }
  }, [configuration, industries, data, setField]);

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="step">
      <h2>Informazioni attività</h2>

      {/* NOME ATTIVITÀ */}
      <input
        placeholder="Nome attività"
        value={data.businessName ?? ""}
        onChange={(e) =>
          setField("businessName", e.target.value)
        }
      />

      {/* SETTORE */}
      <select
        value={data.sector ?? ""}
        onChange={(e) => setField("sector", e.target.value)}
      >
        <option value="">Seleziona settore</option>
        {industries.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>

      {/* CITTÀ */}
      <input
        placeholder="Città"
        value={data.city ?? ""}
        onChange={(e) => setField("city", e.target.value)}
      />

      {/* EMAIL */}
      <input
        placeholder="Email di contatto"
        value={data.email ?? ""}
        onChange={(e) => setField("email", e.target.value)}
      />

      {/* AZIONE */}
      <button onClick={onNext}>
        Continua
      </button>
    </div>
  );
}
