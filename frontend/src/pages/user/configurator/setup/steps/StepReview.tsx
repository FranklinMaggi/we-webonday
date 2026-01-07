// ======================================================
// FE || StepReview.tsx
// ======================================================
//
// RUOLO:
// - Conferma configurazione
// - Salvataggio DRAFT su backend
//
// INVARIANTI:
// - configurationId da route
// - Backend = source of truth
// ======================================================

import { useParams, useNavigate } from "react-router-dom";
import { useConfigurationSetupStore } from "../configurationSetup.store";
import { updateConfiguration } from "../../../../../lib/userApi/configuration.user.api";
import { useState } from "react";

export default function StepReview({
  onBack,
}: {
  onBack: () => void;
}) {
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data } = useConfigurationSetupStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveDraft() {
    if (!configurationId) {
      setError("Configuration ID mancante");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateConfiguration(configurationId, {
        ...data,
        status: "draft",
      });

      // ✅ USCITA CANONICA DAL WIZARD
      navigate(
        `/user/dashboard/configuration/${configurationId}`,
        { replace: true }
      );
    } catch (e: any) {
      setError(e.message ?? "Errore salvataggio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="step">
      <h2>Riepilogo configurazione</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="actions">
        <button onClick={onBack}>Indietro</button>

        <button onClick={saveDraft} disabled={loading}>
          {loading ? "Salvataggio…" : "Salva bozza"}
        </button>
      </div>
    </div>
  );
}
