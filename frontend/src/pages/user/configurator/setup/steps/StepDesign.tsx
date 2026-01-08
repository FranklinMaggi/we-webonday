// ======================================================
// FE || pages/user/business/setup/steps/<StepName>.tsx
// ======================================================
// ORDER SETUP — STEP
//
// RUOLO:
// - Raccolta dati specifici step
//
// RESPONSABILITÀ:
// - Input controllati
// - Scrittura nello store setup
//
// NON FA:
// - NON naviga globalmente
// - NON chiama backend (tranne Review)
//
// NOTE:
// - Stateless rispetto all’ordine globale
// ======================================================
import COLOR_
import { useConfigurationSetupStore } from "../../../../../lib/store/configurationSetup.store";
export default function StepDesign({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { data, setField } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Stile e colori</h2>

      COLOR_PRESETS.map(palette => (
  <button onClick={() => setField("colorPreset", palette.id)}>
    {palette.label}
  </button>
))


<select
        value={data.style ?? "modern"}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setField("style", e.target.value as any)
        }
      >
        <option value="modern">Moderno</option>
        <option value="elegant">Elegante</option>
        <option value="minimal">Minimal</option>
        <option value="bold">Bold</option>
      </select>

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={onNext}>Continua</button>
      </div>
    </div>
  );
}
