import type { CheckoutState, CheckoutStep } from "../types";

interface Props {
  state: CheckoutState;
  setState: React.Dispatch<React.SetStateAction<CheckoutState>>;
  next: (step: CheckoutStep) => void;
}

export default function UserData({ state, next }: Props) {
  return (
    <section>
      <h2>Dati utente</h2>

      <p>
        Email account: <strong>{state.email}</strong>
      </p>

      <button onClick={() => next("policy")}>
        Continua
      </button>
    </section>
  );
}

