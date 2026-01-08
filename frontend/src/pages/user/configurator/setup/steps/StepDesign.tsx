// ======================================================
// FE || pages/user/configurator/setup/steps/StepDesign.tsx
// ======================================================
//
// STEP 2 — DESIGN & STILE
//
// RUOLO:
// - Scelta stile visivo del sito
// - Selezione palette colori (SEMANTICA)
//
// INVARIANTI:
// - Nessuna fetch
// - Nessuna persistenza backend
// - Store FE come unica source of truth
//
// ======================================================

import { useConfigurationSetupStore } from "../../../../../lib/store/configurationSetup.store";
import { COLOR_PRESETS } from "../../../../../lib/configurationLayout/palette.dto";

type StepDesignProps = {
  onNext: () => void;
  onBack: () => void;
};

export default function StepDesign({
  onNext,
  onBack,
}: StepDesignProps) {
  const { data, setField } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Stile e colori</h2>

      {/* ======================================================
         PALETTE COLORI (SEMANTICA)
         - Salviamo SOLO colorPreset (id)
         - Nessun colore raw nello store
      ====================================================== */}
      <div className="palette-grid">
        {COLOR_PRESETS.map((palette) => (
          <button
            key={palette.id}
            type="button"
            className={
              data.colorPreset === palette.id
                ? "palette active"
                : "palette"
            }
            onClick={() =>
              setField("colorPreset", palette.id)
            }
          >
            {palette.label}
          </button>
        ))}
      </div>

      {/* ======================================================
         STILE LAYOUT
         - Riferimento semantico
      ====================================================== */}
      <select
        value={data.style ?? "modern"}
        onChange={(e) =>
          setField("style", e.target.value as any)
        }
      >
        <option value="modern">Moderno</option>
        <option value="elegant">Elegante</option>
        <option value="minimal">Minimal</option>
        <option value="bold">Bold</option>
      </select>

      {/* ======================================================
         AZIONI
      ====================================================== */}
      <div className="actions">
        <button type="button" onClick={onBack}>
          Indietro
        </button>
        <button type="button" onClick={onNext}>
          Continua
        </button>
      </div>
    </div>
  );
}
