// ======================================================
// FE || pages/user/configurator/setup/ConfigurationSetupPage.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION SETUP PAGE
//
// RUOLO:
// - Orchestratore UI del wizard di configurazione
// - Gestisce la navigazione tra gli step
// - Precompila lo stato FE partendo da una configuration esistente
//
// SOURCE OF TRUTH:
// - Stato wizard → Zustand (useConfigurationSetupStore)
// - Dati iniziali → configuration (backend, post-cart / edit)
//
// INVARIANTI:
// - Nessuna fetch
// - Nessuna persistenza
// - Nessuna business logic
//
// PRINCIPI:
// - Questo componente NON salva dati
// - NON valida input
// - NON decide cosa inviare al backend
//
// NOTE ARCHITETTURALI:
// - Prefill idempotente (una sola volta)
// - Ogni Step lavora ESCLUSIVAMENTE sullo store
// - ConfigurationSetupPage coordina, non contiene logica di dominio
// ======================================================

import { useEffect, useRef, useState } from "react";
import { useConfigurationSetupStore } from "./configurationSetup.store";

import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepDesign from "./steps/StepDesign";
import StepContent from "./steps/StepContent";
import StepExtra from "./steps/StepExtra";
import StepReview from "./steps/StepReview";

/* ======================================================
   PROPS
====================================================== */
export type ConfigurationSetupPageProps = {
  /**
   * Snapshot opzionale della configuration
   * (derivata da carrello o configurazione esistente)
   */
  configuration?: {
    business?: {
      name?: string;
      type?: string;
      city?: string;
      email?: string;
      phone?: string;
    };
    productId?: string;
    optionIds?: string[];
  };

  /**
   * Settori consentiti per la solution selezionata
   * (source of truth: backend)
   */
  industries?: string[];
};

/* ======================================================
   COSTANTI
====================================================== */
const STEPS = ["business", "design", "content", "extra", "review"] as const;

export default function ConfigurationSetupPage({
  configuration,
  industries = [],
}: ConfigurationSetupPageProps) {
  /* ======================================================
     STATO NAVIGAZIONE WIZARD
  ====================================================== */
  const [stepIndex, setStepIndex] = useState(0);

  /* ======================================================
     ACCESSO ALLO STORE
     - data: stato attuale wizard
     - setField: mutazione atomica (campo singolo)
  ====================================================== */
  const { data, setField } = useConfigurationSetupStore();

  /* ======================================================
     PREFILL GUARD
     PERCHE:
     - React StrictMode monta due volte
     - Evitiamo override dell’input utente
  ====================================================== */
  const prefilledRef = useRef(false);

  /* ======================================================
     PREFILL DA CONFIGURATION (POST-CART / EDIT)
     VERBO: "prefill"
     SIGNIFICATO:
     - Inizializza lo stato FE
     - NON sovrascrive campi già compilati
     - Avviene UNA SOLA VOLTA
  ====================================================== */
  useEffect(() => {
    if (!configuration) return;
    if (prefilledRef.current) return;

    // ================= NOME ATTIVITÀ =================
    if (configuration.business?.name && !data.businessName) {
      setField("businessName", configuration.business.name);
    }

    // ================= SETTORE =================
    if (
      configuration.business?.type &&
      !data.sector &&
      industries.includes(configuration.business.type)
    ) {
      setField("sector", configuration.business.type);
    }

    // ================= CITTÀ =================
    if (configuration.business?.city && !data.city) {
      setField("city", configuration.business.city);
    }

    // ================= EMAIL =================
    if (configuration.business?.email && !data.email) {
      setField("email", configuration.business.email);
    }

    // ================= TELEFONO =================
    if (configuration.business?.phone && !data.phone) {
      setField("phone", configuration.business.phone);
    }

    prefilledRef.current = true;
  }, [configuration, industries, data, setField]);

  /* ======================================================
     NAVIGATION VERBS
     - next  → avanza step
     - back  → torna allo step precedente
  ====================================================== */
  const next = () =>
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));

  const back = () =>
    setStepIndex((i) => Math.max(i - 1, 0));

  /* ======================================================
     STEP SWITCH
     RUOLO:
     - Decide quale STEP montare
     - Passa SOLO le props necessarie
  ====================================================== */
  switch (STEPS[stepIndex]) {
    case "business":
      return (
        <StepBusinessInfo
          onNext={next}
          configuration={configuration}
          industries={industries}
        />
      );

    case "design":
      return <StepDesign onNext={next} onBack={back} />;

    case "content":
      return <StepContent onNext={next} onBack={back} />;

    case "extra":
      return <StepExtra onNext={next} onBack={back} />;

    case "review":
      return <StepReview onBack={back} />;

    default:
      return null;
  }
}
