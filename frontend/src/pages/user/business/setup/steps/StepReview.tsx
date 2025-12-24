import { useOrderSetupStore } from "../orderSetup.store";
import { saveOrderSetup } from "../../../../../lib/orders/orderSetupApi";
export default function StepReview({
  onBack,
  orderId,
}: {
  onBack: () => void;
  orderId: string;
}) {
  const { data, reset } = useOrderSetupStore();

  async function submit() {
    await saveOrderSetup(orderId, data as any);
    reset();
    alert("Configurazione salvata");
  }

  return (
    <div className="step">
      <h2>Riepilogo</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>

      <button onClick={onBack}>Indietro</button>
      <button onClick={submit}>Conferma configurazione</button>
    </div>
  );
}
