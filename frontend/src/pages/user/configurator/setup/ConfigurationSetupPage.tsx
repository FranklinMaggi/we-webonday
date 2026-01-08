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
import { useAuthStore } from "../../../../store/auth.store";

import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepDesign from "./steps/StepDesign";
import StepContent from "./steps/StepContent";
import StepExtra from "./steps/StepExtra";
import StepReview from "./steps/StepReview";

export type ConfigurationSetupPageProps = {
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

  industries?: string[];
};

const STEPS = ["business", "design", "content", "extra", "review"] as const;

export default function ConfigurationSetupPage({
  configuration,
  industries = [],
}: ConfigurationSetupPageProps) {
  /* =========================
     HOOKS
  ========================= */
  const [stepIndex, setStepIndex] = useState(0);

  const { data, setField } = useConfigurationSetupStore();
  const { user } = useAuthStore(); // ✅ CORRETTO: dentro il componente

  const prefilledRef = useRef(false);

  /* ======================================================
     PREFILL INIZIALE (UNA SOLA VOLTA)
     COSA FA:
     1. email → dalla sessione (SEMPRE)
     2. dati business → SOLO se configuration esiste
  ====================================================== */
  useEffect(() => {
    if (prefilledRef.current) return;

    // ===== EMAIL DA LOGIN =====
    if (user?.email && !data.email) {
      setField("email", user.email);
    }

    // ===== DATI DA CONFIGURATION (solo /[id]) =====
    if (configuration) {
      if (configuration.business?.name && !data.businessName) {
        setField("businessName", configuration.business.name);
      }

      if (
        configuration.business?.type &&
        !data.sector &&
        industries.includes(configuration.business.type)
      ) {
        setField("sector", configuration.business.type);
      }

      if (configuration.business?.city && !data.city) {
        setField("city", configuration.business.city);
      }

      if (configuration.business?.phone && !data.phone) {
        setField("phone", configuration.business.phone);
      }
    }

    prefilledRef.current = true;
  }, [user, configuration, industries, data, setField]);

  /* =========================
     NAVIGAZIONE
  ========================= */
  const next = () =>
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));

  const back = () =>
    setStepIndex((i) => Math.max(i - 1, 0));

  /* =========================
     RENDER STEP
  ========================= */
  switch (STEPS[stepIndex]) {
    case "business":
      return <StepBusinessInfo onNext={next} />;

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
