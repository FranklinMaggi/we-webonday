// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// STEP 1 — BUSINESS INFO (FORM GREZZO)
//
// NOTE:
// - SOLO UI
// - Nessuna logica
// - Nessuna persistenza
// - Nessun prefill
// - Serve SOLO a definire struttura e UX
// ======================================================

type StepBusinessInfoProps = {
  onNext: () => void;
};

export default function StepBusinessInfo({ onNext }: StepBusinessInfoProps) {
  return (
    <div className="step">
      <h2>Dati dell’attività</h2>

      {/* INTRO TESTUALE */}
      <p style={{ opacity: 0.75, fontSize: "0.95rem" }}>
        Queste informazioni ci servono per avviare la configurazione del tuo sito.
        Potrai modificarle in seguito.
      </p>

      {/* =========================
          CONTATTI
      ========================= */}

      <input
        type="email"
        placeholder="Email di riferimento"
      />

      <input
        type="tel"
        placeholder="Numero di telefono (opzionale)"
      />

      <label>
        <input type="checkbox" />
        Desidero essere contattato da un consulente WebOnDay per una guida dedicata
      </label>

      <label>
        <input type="checkbox" />
        Autorizzo l’utilizzo del numero solo per comunicazioni legate al progetto
      </label>

      {/* =========================
          DATI ATTIVITÀ
      ========================= */}

      <input
        type="text"
        placeholder="Nome dell’attività"
      />

      <input
        type="text"
        placeholder="Indirizzo (via, città)"
      />

      <textarea
        placeholder="Orari di apertura (opzionale)"
      />

      {/* =========================
          UPLOAD
      ========================= */}

      <label>
        Hai un logo o un documento per confermare l’attività?
      </label>

      <input
        type="file"
        accept="image/*,.pdf"
      />

      <p style={{ fontSize: "0.85rem", opacity: 0.65 }}>
        Puoi caricare un logo, una foto dell’attività o un documento.
        Serve solo a velocizzare la verifica.
      </p>

      {/* =========================
          AZIONI
      ========================= */}

      <div className="actions">
        <button onClick={onNext}>
          Continua
        </button>
      </div>
    </div>
  );
}
