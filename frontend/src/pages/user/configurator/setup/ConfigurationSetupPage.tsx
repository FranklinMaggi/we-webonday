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
// ======================================================
// AI-SUPERCOMMENT — CONFIGURATOR FLOW (CANONICAL)
//
// FLUSSO COMPLETO:
//
// 1. StepProductIntro
//    - Contesto
//    - Nessuna modifica store
//
// 2. StepBusinessInfo
//    - Raccolta dati business
//    - Scrittura store FE
//
// 3. StepDesign
//    - Scelta stile / palette
//    - Scrittura store FE
//
// 4. StepLayoutGenerator   ← STEP PREPARATORIO
//    - Deriva visibility
//    - Valida prerequisiti layout
//    - NON mostra layout
//
// 5. StepReview            ← STEP DI SCELTA
//    - Fetch layout disponibili (BE)
//    - Render preview layout (business-aware)
//    - Selezione layoutId
//    - Persistenza configuration (draft)
//
// INVARIANTE:
// - Nessuno step salta il precedente
// - La selezione layout avviene SOLO in StepReview
//
// ======================================================

import { useState ,useEffect } from "react";

import { useConfigurationSetupStore } from "../../../../lib/store/configurationSetup.store";
import { fetchPublicSolutionById } from "../../../../lib/solutions/solutions.public.api";
import StepProductIntro from "./steps/StepProductIntro";
import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepDesign from "./steps/StepDesign";

import StepReview from "./steps/StepReview";
import StepLayoutGenerator from "./steps/StepLayoutGenerator";
import { initDevConfiguration } from "../../../../lib/store/configurationSetup.dev";



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
  const isDev =
    import.meta.env.DEV ||
    location.hostname === "localhost";

  if (isDev) {
    initDevConfiguration();
  }

  
  const [stepIndex, setStepIndex] = useState(0);

  const { data , setField} = useConfigurationSetupStore();


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
  useEffect(() => {
    const solutionId = data.solutionId;
    if (!solutionId) return;
  
    let cancelled = false;
  
    (async () => {
      const solution = await fetchPublicSolutionById(
        solutionId
      );
  
      if (cancelled) return;
  
      setField(
        "solutionDescriptionTags",
        solution.descriptionTags ?? []
      );
  
      setField(
        "solutionServiceTags",
        solution.serviceTags ?? []
      );
    })();
  
    return () => {
      cancelled = true;
    };
  }, [data.solutionId]);
  
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
      return <StepLayoutGenerator onNext={next} onBack={back} />;

    case "review":
      return <StepReview onBack={back} />;

    default:
      return null;
  }
}
