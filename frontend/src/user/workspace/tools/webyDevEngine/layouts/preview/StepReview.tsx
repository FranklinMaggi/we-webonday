// ======================================================
// FE || STEP — LAYOUT SELECTION (CANONICAL)
// ======================================================
//
// RESPONSABILITÀ:
// - Unico consumer dei layout BE
// - Unico punto di selezione layoutId
// - Ultimo step prima del checkout
//
// INVARIANTI:
// - Nessuna decisione di pricing
// - Nessuna creazione ordine
// - Checkout NON sceglie layout
//
// ======================================================

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import { fetchAvailableLayouts } from "@shared/lib/userApi/layout.user.api";
import { updateConfiguration } from "@src/user/configurator/base_configuration/configuration/api/get.my-pre-configuration";

import type { LayoutKVDTO } from "../../configurationLayout/layout.dto";

type Props = {
  onBack: () => void;
};

export default function StepReview({ onBack }: Props) {
  /* ======================================================
     CONTEXT
  ====================================================== */
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useConfigurationSetupStore();

  /* ======================================================
     STATE
  ====================================================== */
  const [layouts, setLayouts] = useState<LayoutKVDTO[]>([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ======================================================
     LOAD LAYOUTS (BE)
  ====================================================== */
  useEffect(() => {
    if (!data.solutionId || !data.productId) {
      setError("Configurazione incompleta");
      return;
    }

    async function loadLayouts() {
      try {
        const res = await fetchAvailableLayouts({
          solutionId: data.solutionId!,
          productId: data.productId!,
        });

        setLayouts(res.layouts ?? []);
      } catch {
        setError("Errore nel caricamento dei layout");
      }
    }

    loadLayouts();
  }, [data.solutionId, data.productId]);

  /* ======================================================
     CTA — SAVE & CONTINUE
  ====================================================== */
  async function confirmLayout() {
    if (!configurationId || !selectedLayoutId) return;

    setLoading(true);
    setError(null);

    try {
      await updateConfiguration(configurationId, {
        ...data,
        layoutId: selectedLayoutId,
        status: "draft",
      });

      // 🔁 HANDOFF (scegline uno)
      // navigate(`/user/checkout/${configurationId}`);
      navigate(`/user/dashboard/configurator/${configurationId}`);
    } catch (e: any) {
      setError(e.message ?? "Errore salvataggio configurazione");
    } finally {
      setLoading(false);
    }
  }

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="step step-review">
      <h2>Scegli il layout del tuo sito</h2>

      <p style={{ opacity: 0.7 }}>
        Questo layout sarà incluso nel progetto finale.
      </p>

      {error && <p className="error">{error}</p>}

      {/* =========================
         LAYOUT GRID
      ========================= */}
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
          
            <h4>{layout.name}</h4>
            <p>{layout.description}</p>
          </div>
        ))}
      </div>

      {/* =========================
         ACTIONS
      ========================= */}
      <div className="actions">
        <button type="button" onClick={onBack}>
          Indietro
        </button>

        <button
          type="button"
          onClick={confirmLayout}
          disabled={!selectedLayoutId || loading}
        >
          {loading ? "Salvataggio…" : "Conferma layout e continua"}
        </button>
      </div>
    </div>
  );
}
