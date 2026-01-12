// NOTA ARCHITETTURALE:
//
// Questo step NON mostra layout.
// Serve esclusivamente a:
// - derivare visibility
// - garantire che i dati minimi esistano
//
// La preview e la selezione layout
// avvengono ESCLUSIVAMENTE nello step successivo.
// ======================================================
// FE || STEP — LAYOUT PREPARATION (CANONICAL)
//
// RUOLO:
// - Prepara la Configuration per la selezione layout
// - Deriva la VISIBILITÀ delle sezioni
// - NON decide struttura (layout = source of truth)
//
// INVARIANTI:
// - Nessuna fetch
// - Nessuna persistenza backend
// - Nessuna struttura custom
// ======================================================

import { useEffect } from "react";
import { useConfigurationSetupStore } from "../../../../../lib/store/configurationSetup.store";
import { DEFAULT_VISIBILITY } from "../../../../../lib/configurationLayout/visibility.defaults";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function StepLayoutGenerator({
  onNext,
  onBack,
}: Props) {
  const { data, setField } = useConfigurationSetupStore();

  /* ======================================================
     DERIVAZIONE VISIBILITÀ (DETERMINISTICA)
     - Layout userà questi flag
  ====================================================== */

  const derivedVisibility = {
    ...DEFAULT_VISIBILITY,

    contactForm: !!data.email,
    address: !!data.address,
    openingHours: !!data.openingHours,
    gallery: false, // attivabile post-vendita
  };

  /* ======================================================
     VALIDAZIONE STEP
  ====================================================== */

  const isComplete =
    !!data.businessName &&
    (!!data.description || !!data.services);

  /* ======================================================
     SCRITTURA STORE (ON MOUNT)
  ====================================================== */

  useEffect(() => {
    setField("visibility", derivedVisibility);
  }, [
    setField,
    data.email,
    data.address,
    data.openingHours,
  ]);

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="step">
      <h2>Preparazione layout</h2>

      <p style={{ opacity: 0.7 }}>
        In base ai dati inseriti, abbiamo preparato la
        configurazione per la selezione del layout.
      </p>

      <ul>
        <li>Contatti: {derivedVisibility.contactForm ? "✓" : "—"}</li>
        <li>Indirizzo: {derivedVisibility.address ? "✓" : "—"}</li>
        <li>Orari: {derivedVisibility.openingHours ? "✓" : "—"}</li>
      </ul>

      {!isComplete && (
        <p className="error">
          Inserisci almeno una descrizione o un servizio per
          continuare.
        </p>
      )}
 


      <div className="actions">
        <button type="button" onClick={onBack}>
          Indietro
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
        >
          Continua
        </button>
      </div>
    </div>
  );
}
