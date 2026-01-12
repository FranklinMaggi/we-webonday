// ======================================================
// AI-SUPERCOMMENT — LAYOUT COME BENE VENDUTO (CANONICO)
//
// DECISIONE:
// - Il layout selezionato in questo step È PARTE DEL PRODOTTO
// - Non è solo preview UI
//
// EFFETTI:
// - layoutId viene persistito nella Configuration
// - Il layout è incluso nel valore economico venduto
// - Dopo l’acquisto:
//   • il layout NON è più sostituibile liberamente
//   • eventuali cambi sono POST-VENDITA (upgrade / revisione)
//
// INVARIANTI (NON NEGOZIABILI):
// 1. Questo è l’UNICO punto di selezione layout
// 2. Il checkout NON decide il layout
// 3. L’ordine fotografa il layout scelto
//
// STATO:
// - CANONICO
// - BLOCCATO STRUTTURALMENTE
// ======================================================

import { useParams, useNavigate } from "react-router-dom";
import { useConfigurationSetupStore } from "../../../../../lib/store/configurationSetup.store";
import { updateConfiguration } from "../../../../../lib/userApi/configuration.user.api";
import { useEffect, useState } from "react";
import type { LayoutKVDTO } from "../../../../../lib/configurationLayout/layout.dto";
import { LayoutPreview } from "../../layouts/preview/LayoutPreview";
import { fetchAvailableLayouts } from "../../../../../lib/userApi/layout.user.api";


export default function StepReview({ onBack }: { onBack: () => void }) {
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useConfigurationSetupStore();

  const [layouts, setLayouts] = useState<LayoutKVDTO[]>([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isReadyForCheckout =
  !!data.solutionId &&
  !!data.productId &&
  !!selectedLayoutId &&
  !!data.businessName;

if (!isReadyForCheckout) {
  return (
    <div className="step">
      <h2>Configurazione incompleta</h2>
      <p>
        Completa tutti i passaggi prima di procedere.
      </p>
      <button onClick={onBack}>Torna indietro</button>
    </div>
  );
}

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
