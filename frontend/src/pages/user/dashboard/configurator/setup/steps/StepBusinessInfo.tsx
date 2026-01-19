// ======================================================
// FE || STEP — BUSINESS INFO (CANONICAL SEED)
// ======================================================
//
// RUOLO:
// - Carica dati READ-ONLY da Solution (public)
// - Inietta seed nel BusinessForm
//
// INVARIANTI:
// - UNICO punto FE che legge Solution_KV
// - Nessuna scrittura
// - Nessuna logica di fallback UI
// ======================================================

import { useEffect, useState } from "react";

import { useConfigurationSetupStore } from "../../store/configurationSetup.store";
import BusinessForm from "../../../../../../domains/business/BusinessForm";

import { getSolutionById } from "../../../../../../domains/buyflow/api/publiApi/solutions/solutions.public.api";
/* ======================================================
   LOCAL SEED (FE INTERNAL)
====================================================== */
export type SolutionSeed = {
  descriptionTags: string[];
  serviceTags: string[];
  openingHoursDefault: Record<string, string> | null;
};

/* ======================================================
   COMPONENT
====================================================== */
export default function StepBusinessInfo({
  onNext,
}: {
  onNext: () => void;
}) {
  /* =========================
     STORE (SOURCE OF TRUTH)
  ========================= */
  const { data } = useConfigurationSetupStore();

  /* =========================
     LOCAL STATE
  ========================= */
  const [seed, setSeed] = useState<SolutionSeed | null>(null);
  console.log("[STEP_BUSINESS] store snapshot", {
    businessName: data.businessName,
    solutionId: data.solutionId,
  });
  
  /* ======================================================
     HARD GUARD — BUSINESS NAME
     (deriva da Configuration.prefill)
  ====================================================== */
  if (!data.businessName) {
    return (
      <div className="step-error">
        <h2>Nome attività mancante</h2>
        <p>
          Il nome dell’attività deve essere definito prima di
          iniziare la configurazione.
        </p>
      </div>
    );
  }

  /* ======================================================
     LOAD SOLUTION SEED (READ ONLY)
  ====================================================== */
  useEffect(() => {
    console.log("[STEP_BUSINESS] loading solution seed", data.solutionId);

    if (!data.solutionId) return;

    let cancelled = false;

    async function loadSeed() {
      try {
        
        const solution = await getSolutionById(
          data.solutionId
          
        );
        console.log("[STEP_BUSINESS] seed loaded", seed);
        if (cancelled) return;

        setSeed({
          descriptionTags:
            solution.descriptionTags ?? [],
          serviceTags:
            solution.serviceTags ?? [],
          openingHoursDefault:
            solution.openingHoursDefault ?? null,
        });
      } catch {
        // FAIL SILENTLY
        // Il BusinessForm resta comunque utilizzabile
      }
    }

    loadSeed();

    return () => {
      cancelled = true;
    };
  }, [data.solutionId]);

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <BusinessForm
      solutionSeed={seed}
      onComplete={onNext}
    />
  );
}
