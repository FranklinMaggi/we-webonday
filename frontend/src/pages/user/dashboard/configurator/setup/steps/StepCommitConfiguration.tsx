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

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useConfigurationSetupStore } from "../../store/configurationSetup.store";
import { updateConfiguration } from "../../api/configuration.user.api";

export default function StepCommitConfiguration({
  onBack,
}: {
  onBack: () => void;
}) {
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useConfigurationSetupStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCommit() {
    if (!configurationId) return;

    setLoading(true);
    setError(null);

    try {
      await updateConfiguration(configurationId, {
        ...data,
        status: "draft",
      });

      navigate(`/user/dashboard/configuration/${configurationId}`);
    } catch (e: any) {
      setError("Errore nel salvataggio");
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
