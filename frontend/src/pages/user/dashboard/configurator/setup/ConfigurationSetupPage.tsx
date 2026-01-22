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
// - Legge dati minimi dallo store Zustand
// - Renderizza lo step corretto
//
// COSA NON FA:
// - ❌ NON fa fetch
// - ❌ NON inizializza dati business
// - ❌ NON persiste nulla
// - ❌ NON conosce logiche degli step
//
// SOURCE OF TRUTH:
// - configurationSetupStore (Zustand)
//
// ======================================================

import { useState } from "react";
import { useConfigurationSetupStore } from "../store/configurationSetup.store";

//import StepProductIntro from "./steps/StepProductIntro";
import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepOwnerInfo from "./steps/StepOwnerInfo";
import StepCommitConfiguration from "./steps/StepCommitConfiguration";
import StepComplete from "./steps/StepComplete";
//import StepDesign from "./steps/StepDesign";
//import StepLayoutGenerator from "./steps/StepLayoutGenerator";
//import StepReview from "./steps/StepReview";

/* =========================
   STEPS ORDER (CANONICAL)
========================= */
const STEPS = [
  { key: "business", label: "Business" },
  { key: "owner", label: "Titolare" },
  { key: "commit", label: "Conferma" },
  {key: "complete", label: "Completato" }
] as const;



type StepKey = (typeof STEPS)[number]["key"];

export default function ConfigurationSetupPage() {
  /* =========================
     STATE — SOLO UI
  ========================= */
  const [stepIndex, setStepIndex] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const { data } = useConfigurationSetupStore();
  console.log("[SETUP_PAGE] init", {
    configurationId: data.configurationId,
    solutionId: data.solutionId,
    productId: data.productId,
  });
  /* =========================
     GUARD — STATO MINIMO
     (FAIL FAST, ADHD-SAFE)
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
  {
    setStepIndex((i) => {
      const nextIndex = Math.min(i + 1, STEPS.length - 1);
      setMaxReachedStep((m) => Math.max(m, nextIndex));
      return nextIndex;
    });
  };

  const back = () =>
    setStepIndex((i) =>
      Math.max(i - 1, 0)
    );
   
    const goToStep = (index: number) => {
      if (index <= maxReachedStep) {
        setStepIndex(index);
      }
    };
    
    const progress =
    ((stepIndex + 1) / STEPS.length) * 100;

  const currentStep: StepKey = STEPS[stepIndex].key;
 
/* =========================
     UI
  ========================= */
  return (
    <div className="configuration-setup">

      {/* =========================
         PROGRESS BAR + LABELS
      ========================= */}
      <div className="wizard-progress">
        <div className="wizard-progress-bar">
          <div
            className="wizard-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="wizard-steps">
          {STEPS.map((step, index) => {
            const isActive = index === stepIndex;
            const isClickable = index <= maxReachedStep;

            return (
              <button
                key={step.key}
                type="button"
                className={`wizard-step
                  ${isActive ? "active" : ""}
                  ${isClickable ? "clickable" : "disabled"}
                `}
                onClick={() => goToStep(index)}
                disabled={!isClickable}
              >
                <span className="wizard-step-index">
                  {index + 1}
                </span>
                <span className="wizard-step-label">
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================
         STEP RENDER
      ========================= */}
      {(() => {
        switch (currentStep) {
          case "business":
            return <StepBusinessInfo onNext={next} />;
        
          case "owner":
            return (
              <StepOwnerInfo
              
                onBack={back}
                onNext={next}
              />
            );
        
          case "commit":
            return (
              <StepCommitConfiguration
                onBack={back}
                onNext={next}
              />
            );
            case "complete":
            return (
              <StepComplete
             
              />
            );
        
          default:
            return null;
        }
        
      })()}
    </div>
  );
}
