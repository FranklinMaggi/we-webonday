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

import { useConfigurationSetupStore } from "../configurationSetup.store";

export default function StepContent({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { data, setField } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Contenuti</h2>

      <textarea
        placeholder="Descrizione attività"
        value={data.description ?? ""}
        onChange={(e) => setField("description", e.target.value)}
      />

      <textarea
        placeholder="Servizi / prodotti"
        value={data.services ?? ""}
        onChange={(e) => setField("services", e.target.value)}
      />

      <input
        placeholder="Call to action (es. Contattaci ora)"
        value={data.cta ?? ""}
        onChange={(e) => setField("cta", e.target.value)}
      />

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={onNext}>Continua</button>
      </div>
    </div>
  );
}
