import type { CheckoutState, CheckoutStep } from "../types";

interface Props {
  state: CheckoutState;
  setState: React.Dispatch<React.SetStateAction<CheckoutState>>;
  next: (step: CheckoutStep) => void;
}
export default function UserData({ state, setState, next }: Props) {
    return (
      <section>
        <h2>Dati utente</h2>
  
        <input
          type="email"
          value={state.email}
          onChange={(e) =>
            setState((s) => ({ ...s, email: e.target.value }))
          }
          placeholder="email@email.it"
        />
  
        <button
          disabled={!state.email}
          onClick={() => next("policy")}
        >
          Continua
        </button>
      </section>
    );
  }
  