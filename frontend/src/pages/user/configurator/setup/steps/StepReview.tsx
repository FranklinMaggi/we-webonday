// ======================================================
// FE || StepReview.tsx
// ======================================================
//
// STEP 4 — PREVIEW & CONFERMA
//
// RUOLO:
// - Mostra preview layout disponibili
// - Permette selezione layout
// - Salva configurazione DRAFT
//
// INVARIANTI:
// - Layout = backend (KV)
// - Preview = FE render JSON
// - NO AI
// ======================================================

import { useParams, useNavigate } from "react-router-dom";
import { useConfigurationSetupStore } from "../../../../../lib/store/configurationSetup.store";
import { updateConfiguration } from "../../../../../lib/userApi/configuration.user.api";
import { useEffect, useState } from "react";
import type { LayoutKVDTO } from "../../../../../lib/configurationLayout/layout.dto";
import { LayoutPreview } from "../../../../../components/preview/LayoutPreview";
import { fetchAvailableLayouts } from "../../../../../lib/userApi/layout.user.api";


export default function StepReview({ onBack }: { onBack: () => void }) {
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useConfigurationSetupStore();

  const [layouts, setLayouts] = useState<LayoutKVDTO[]>([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // LOAD LAYOUTS FROM BE
  // =========================
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchAvailableLayouts({
          solutionId: data.solutionId!,
          productId: data.productId!,
        });
        setLayouts(res.layouts);
      } catch (e: any) {
        setError("Errore caricamento layout");
      }
    }
    load();
  }, []);

  // =========================
  // SAVE DRAFT
  // =========================
  async function saveDraft() {
    if (!configurationId || !selectedLayoutId) {
      setError("Configurazione incompleta");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateConfiguration(configurationId, {
        ...data,
        layoutId: selectedLayoutId,
        status: "draft",
      });

      navigate(`/user/dashboard/configuration/${configurationId}`, {
        replace: true,
      });
    } catch (e: any) {
      setError(e.message ?? "Errore salvataggio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="step">
      <h2>Scegli il layout del tuo sito</h2>

      {error && <p className="error">{error}</p>}

      <div className="layout-grid">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            className={
              selectedLayoutId === layout.id
                ? "layout-card selected"
                : "layout-card"
            }
            onClick={() => setSelectedLayoutId(layout.id)}
          >

            {/* QUI VA IL RENDERER */}
            {/* <LayoutPreview layout={layout} data={data} /> */}
            <LayoutPreview layout={layout} data={data} />
       
            <h4>{layout.name}</h4>
            <p>{layout.description}</p>
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button
          disabled={!selectedLayoutId || loading}
          onClick={saveDraft}
        >
          {loading ? "Salvataggio…" : "Conferma e salva"}
        </button>
      </div>
    </div>
  );
}
