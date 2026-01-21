// ======================================================
// FE || STEP — COMMIT CONFIGURATION
// ======================================================
//
// RUOLO:
// - Scrive la configuration nel backend
// - Punto di verità
// - Fine configurator
//
// ======================================================

import { useNavigate } from "react-router-dom";
import {useState } from "react";
import { attachOwnerToConfiguration } from "../../api/business/configuration.draft.complete";
import { useConfigurationSetupStore } from "../../store/configurationSetup.store";
import { updateConfiguration } from "../../api/configuration.user.api";

export default function StepCommitConfiguration({
  onBack,
}: {
  onBack: () => void;
}) {
  const { data } = useConfigurationSetupStore();
  const navigate = useNavigate();
  const configurationId=data.configurationId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCommit() {
    if (!configurationId) return;
  
    setLoading(true);
    setError(null);
  
    try {
      /* =====================
         1️⃣ UPDATE CONFIGURATION (FINAL SNAPSHOT)
      ====================== */
      await updateConfiguration(configurationId, {
        ...data,
        status: "draft", // oppure "complete" se deciso
      });
  
      /* =====================
         2️⃣ ATTACH OWNER → CONFIGURATION
      ====================== */
      const attachRes = await attachOwnerToConfiguration({
        configurationId,
      });
  
      if (!attachRes.ok) {
        throw new Error(
          attachRes.error ??
          "ATTACH_OWNER_FAILED"
        );
      }
  
      /* =====================
         3️⃣ NAVIGATE (LAST)
      ====================== */
      navigate(
        `/user/dashboard/configuration/${configurationId}`,
        { replace: true }
      );
    } catch (e) {
      console.error(
        "[STEP_COMMIT][ERROR]",
        e
      );
      setError("Errore nel salvataggio finale");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="step">
      <h2>Conferma configurazione</h2>

      <p>
        Stiamo per salvare la configurazione del tuo business.
      </p>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={handleCommit} disabled={loading}>
          {loading ? "Salvataggio…" : "Conferma"}
        </button>
      </div>
    </div>
  );
}
