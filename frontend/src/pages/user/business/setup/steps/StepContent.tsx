import { useOrderSetupStore } from "../orderSetup.store";

export default function StepContent({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { data, setField } = useOrderSetupStore();

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
