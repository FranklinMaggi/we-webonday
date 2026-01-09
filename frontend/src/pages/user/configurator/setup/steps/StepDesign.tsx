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
import { LAYOUT_STYLES } from "../../../../../lib/configurationLayout/style.dto";
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
      <h2>Personalizza lo stile del tuo sito</h2>
            <p className="step-subtitle">
              Scegli l’atmosfera visiva che rappresenta meglio la tua attività.
              Potrai sempre modificarla in seguito.
            </p>

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
          ? "palette-card active"
          : "palette-card"
      }
      onClick={() => setField("colorPreset", palette.id)}
    >
      <div
        className="palette-preview"
        style={{
          background: palette.colors.background,
          color: palette.colors.text,
        }}
      >
        <div
          className="palette-primary"
          style={{ background: palette.colors.primary }}
        />
        <div
          className="palette-secondary"
          style={{ background: palette.colors.secondary }}
        />
      </div>

      <span>{palette.label}</span>
    </button>
  ))}
</div>




<div className="style-grid">
  {LAYOUT_STYLES.map((style) => (
    <button
      key={style.id}
      type="button"
      className={
        data.style === style.id
          ? "style-card active"
          : "style-card"
      }
      onClick={() => setField("style", style.id)}
    >
      <h3 className={`style-title style-${style.id}`}>
        {data.businessName || "Nome attività"}
      </h3>

      <p className="style-description">
        {style.description}
      </p>
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
