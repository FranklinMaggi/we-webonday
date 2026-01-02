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

export default function StepExtra({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { data, setField } = useOrderSetupStore();

  const extras = data.extras ?? {
    maps: false,
    whatsapp: false,
    newsletter: false,
  };

  function toggle(key: keyof typeof extras) {
    setField("extras", {
      ...extras,
      [key]: !extras[key],
    });
  }

  return (
    <div className="step">
      <h2>Extra opzionali</h2>

      <label>
        <input
          type="checkbox"
          checked={extras.maps}
          onChange={() => toggle("maps")}
        />
        Google Maps
      </label>

      <label>
        <input
          type="checkbox"
          checked={extras.whatsapp}
          onChange={() => toggle("whatsapp")}
        />
        WhatsApp
      </label>

      <label>
        <input
          type="checkbox"
          checked={extras.newsletter}
          onChange={() => toggle("newsletter")}
        />
        Newsletter
      </label>

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={onNext}>Continua</button>
      </div>
    </div>
  );
}
