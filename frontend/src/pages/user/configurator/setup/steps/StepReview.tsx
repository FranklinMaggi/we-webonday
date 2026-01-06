// ======================================================
// FE || StepReview.tsx
// ======================================================
//
// RUOLO:
// - Conferma configurazione
// - Salvataggio draft (FE only per ora)
//
// ======================================================

import { useConfigurationSetupStore } from "../configurationSetup.store";

export default function StepReview({ onBack }: { onBack: () => void }) {
  const { data } = useConfigurationSetupStore();

  function saveDraft() {
    console.log("DRAFT CONFIGURATION", data);
    alert("Configurazione salvata come bozza");
  }

  return (
    <div className="step">
      <h2>Riepilogo configurazione</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>

      <button onClick={onBack}>Indietro</button>
      <button onClick={saveDraft}>Salva bozza</button>
    </div>
  );
}
