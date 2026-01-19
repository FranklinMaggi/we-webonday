// ======================================================
// FE || STEP — OWNER INFO (CANONICAL)
// ======================================================
//
// RUOLO:
// - Raccolta dati referente / titolare
// - FE ONLY
// - Nessuna persistenza backend
//
// INVARIANTI:
// - NON è Business
// - NON scrive in Configuration
// - Usa email da Auth (read-only)
//
// ======================================================

import { useConfigurationSetupStore } from
  "../../store/configurationSetup.store";

/* ======================================================
   COMPONENT
====================================================== */
export default function StepOwnerInfo({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  /* =========================
     STORE (SOURCE OF TRUTH)
  ========================= */
  const { data, setField } =
    useConfigurationSetupStore();

  /* ======================================================
     GUARD MINIMO (FE ONLY)
  ====================================================== */
  function handleNext() {
    if (!data.ownerName?.trim()) {
      alert("Inserisci il nome del referente");
      return;
    }

    // Dominio OWNER CHIUSO
    onNext();
  }

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="step">
      <h2>Dati del referente</h2>

      {/* ================= REFERENTE ================= */}
      <input
        placeholder="Nome e Cognome"
        value={data.ownerName ?? ""}
        onChange={(e) =>
          setField("ownerName", e.target.value)
        }
      />

      {/* ================= EMAIL (AUTH) ================= */}
      <input
        placeholder="Email"
        value={data.email}
        disabled
      />

      {/* ================= TELEFONO ================= */}
      <input
        placeholder="Telefono"
        value={data.phone ?? ""}
        onChange={(e) =>
          setField("phone", e.target.value)
        }
      />

      {/* ================= CTA ================= */}
      <div className="actions">
        <button onClick={onBack}>
          Indietro
        </button>

        <button onClick={handleNext}>
          Continua
        </button>
      </div>
    </div>
  );
}
