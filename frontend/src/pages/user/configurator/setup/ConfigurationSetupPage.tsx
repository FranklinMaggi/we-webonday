// ======================================================
// FE || pages/user/configurator/setup/ConfigurationSetupPage.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION WIZARD (UI ONLY)
//
// RUOLO:
// - Orchestratore UI del wizard di configurazione
// - Gestisce SOLO:
//   • step corrente
//   • navigazione avanti / indietro
//   • rendering degli step
//
// COSA FA:
// - Legge dati dallo store Zustand
// - Passa i dati ai componenti di step
//
// COSA NON FA:
// - ❌ NON inizializza lo stato
// - ❌ NON legge carrello
// - ❌ NON legge auth
// - ❌ NON fa fetch
// - ❌ NON persiste nulla
//
// SOURCE OF TRUTH:
// - configurationSetupStore (Zustand)
//
// ======================================================

import { useState } from "react";

import { useConfigurationSetupStore } from "../../../../lib/store/configurationSetup.store";

import StepProductIntro from "./steps/StepProductIntro";
import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepDesign from "./steps/StepDesign";
import StepExtra from "./steps/StepExtra";
import StepReview from "./steps/StepReview";

/* =========================
   STEPS ORDER
========================= */
const STEPS = [
  "intro",
  "business",
  "design",
  "extra",
  "review",
] as const;

type StepKey = (typeof STEPS)[number];

export default function ConfigurationSetupPage() {
  /* =========================
     STATE
  ========================= */
  const [stepIndex, setStepIndex] = useState(0);

  const { data } = useConfigurationSetupStore();

  /* =========================
     GUARD — STATO MINIMO
     (ADHD-SAFE, FAIL FAST)
  ========================= */
  if (!data.solutionId || !data.productId) {
    return (
      <div className="configuration-error">
        <h2>Configurazione non inizializzata</h2>
        <p>
          Torna alla selezione del prodotto e riprova.
        </p>
      </div>
    );
  }

  /* =========================
     NAVIGATION
  ========================= */
  const next = () =>
    setStepIndex((i) =>
      Math.min(i + 1, STEPS.length - 1)
    );

  const back = () =>
    setStepIndex((i) => Math.max(i - 1, 0));

  const currentStep: StepKey = STEPS[stepIndex];

  /* =========================
     STEP RENDER
  ========================= */
  switch (currentStep) {
    case "intro":
      return <StepProductIntro onNext={next} />;

    case "business":
      return <StepBusinessInfo onNext={next} />;

    case "design":
      return <StepDesign onNext={next} onBack={back} />;

    case "extra":
      return <StepExtra onNext={next} onBack={back} />;

    case "review":
      return <StepReview onBack={back} />;

    default:
      return null;
  }
}
