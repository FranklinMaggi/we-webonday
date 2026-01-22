// ======================================================
// FE || STEP — COMMIT CONFIGURATION (CANONICAL)
// ======================================================
//
// RUOLO:
// - Punto finale del configurator
// - Collega Owner + Business alla Configuration
// - Backend = source of truth
//
// FLOW:
// 1. OwnerDraft ✅
// 2. BusinessDraft ✅
// 3. attachOwnerToConfiguration (COMMIT)
// ======================================================


import { useState } from "react";
import { attachOwnerToConfiguration } from "../../api/business/configuration.draft.complete";
import { useConfigurationSetupStore } from "../../store/configurationSetup.store";

export default function StepCommitConfiguration({
  onBack,
  onNext, 
}: {
  onBack: () => void;
  onNext: ()=> void;
}) {
  const { data } = useConfigurationSetupStore();

  const configurationId = data.configurationId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCommit() {
    if (!configurationId) return;

    setLoading(true);
    setError(null);

    try {
      /* =====================
         COMMIT (BACKEND)
         - OwnerDraft completo
         - BusinessDraft completo
         - Attach + state advance
      ====================== */
      const res = await attachOwnerToConfiguration({
        configurationId,
    
      });

      if (!res?.ok) {
        throw new Error(
          res?.error ?? "ATTACH_OWNER_FAILED"
        );
      }

      /* =====================
         NAVIGATION (LAST STEP)
      ====================== */
    // ✅ PASSAGGIO ALLO STEP COMPLETE
    onNext();
  } catch (e) {
    console.error("[STEP_COMMIT][ERROR]", e);
    setError("Errore nel salvataggio finale");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="step">
      <h2>Conferma configurazione</h2>

      <p>
        Stiamo per finalizzare la configurazione del tuo business.
      </p>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button onClick={onBack} disabled={loading}>
          Indietro
        </button>

        <button onClick={handleCommit} disabled={loading}>
          {loading ? "Salvataggio…" : "Conferma"}
        </button>
      </div>
    </div>
  );
}
