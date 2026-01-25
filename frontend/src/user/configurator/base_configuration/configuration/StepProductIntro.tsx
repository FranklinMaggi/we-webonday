// ======================================================
// FE || CONFIGURATOR — PRODUCT INTRO
// ======================================================
//
// RUOLO:
// - Schermata di contesto iniziale
// - Conferma visiva di cosa stiamo configurando
//
// COSA FA:
// - Mostra solution, prodotto e servizi selezionati
// - Rafforza fiducia e chiarezza
//
// COSA NON FA:
// - NON modifica store
// - NON fa fetch
// - NON richiede input
// ======================================================

import { useConfigurationSetupStore } from "./configurationSetup.store";

type StepProductIntroProps = {
  onNext: () => void;
};

export default function StepProductIntro({ onNext }: StepProductIntroProps) {
  const { data } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Configurazione del tuo progetto</h2>

      <p style={{ opacity: 0.7 }}>
        Stiamo per configurare il tuo prodotto partendo dalle
        informazioni che hai già scelto.
      </p>

      <div
        style={{
          background: "#f7f7f7",
          borderRadius: 8,
          padding: 16,
          marginTop: 12,
        }}
      >
        <p>
          <strong>Attività:</strong>{" "}
          {data.businessName || "Da definire"}
        </p>

        <p>
          <strong>Soluzione:</strong>{" "}
          {data.solutionId ?? "—"}
        </p>

        <p>
          <strong>Prodotto:</strong>{" "}
          {data.productId ?? "—"}
        </p>

        {data.optionIds?.length ? (
          <p>
            <strong>Servizi aggiuntivi:</strong>{" "}
            {data.optionIds.join(", ")}
          </p>
        ) : (
          <p style={{ opacity: 0.6 }}>
            Nessun servizio aggiuntivo selezionato
          </p>
        )}
      </div>

      <div className="actions">
        <button onClick={onNext}>
          Iniziamo la configurazione
        </button>
      </div>
    </div>
  );
}
