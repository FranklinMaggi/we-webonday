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

import { useOrderSetupStore } from "../orderSetup.store";

export default function StepBusinessInfo({ onNext }: { onNext: () => void }) {
  const { data, setField } = useOrderSetupStore();

  return (
    <div className="step">
      <h2>Informazioni attività</h2>

      <input
        placeholder="Nome attività"
        value={data.businessName ?? ""}
        onChange={(e) => setField("businessName", e.target.value)}
      />

      <input
        placeholder="Settore"
        value={data.sector ?? ""}
        onChange={(e) => setField("sector", e.target.value)}
      />

      <input
        placeholder="Città"
        value={data.city ?? ""}
        onChange={(e) => setField("city", e.target.value)}
      />

      <input
        placeholder="Email di contatto"
        value={data.email ?? ""}
        onChange={(e) => setField("email", e.target.value)}
      />

      <button onClick={onNext}>Continua</button>
    </div>
  );
}
