import { useState } from "react";
import { deriveState } from "../api/configuration.derive-state";
import { useConfigurationSetupStore }from "@src/user/editor/api/type/configurator/configurationSetup.store"

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
    console.log("[ATTACH_OWNER][STORE_SNAPSHOT]", {
      configurationId: data.configurationId,
      solutionId: data.solutionId,
      productId: data.productId,
      businessDraftId: data.businessDraftId,
    });
    try {
      const res = await deriveState({
        configurationId,
    
      });if (!configurationId) {
        console.error("[ATTACH_OWNER][BLOCKED] missing configurationId");
        setError("Configurazione non valida. Ricarica la pagina.");
        return;
      }

      if (!res || res.ok === false) {
        throw new Error(res?.error ?? "ATTACH_OWNER_FAILED");
      }
      if (res.ok !== true) return;
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
