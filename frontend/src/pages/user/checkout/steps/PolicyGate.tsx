interface Props {
    acceptPolicy: () => Promise<void>;
    state: { loading: boolean; error?: string };
  }
  
  export default function PolicyGate({ acceptPolicy, state }: Props) {
    return (
      <section>
        <h2>Privacy & Termini</h2>
  
        <p>
          Per continuare devi accettare la privacy policy.
        </p>
  
        {state.error && <p style={{ color: "red" }}>{state.error}</p>}
  
        <button disabled={state.loading} onClick={acceptPolicy}>
          Accetta e continua
        </button>
      </section>
    );
  }
  