// ======================================================
// FE || pages/user/configurator/setup/steps/StepContent.tsx
// ======================================================
//
// STEP 3 — CONTENUTI & VISIBILITÀ
//
// RUOLO:
// - Raccolta contenuti testuali principali
// - Definizione di COSA mostrare nel sito
//
// CONCETTO:
// - Questo step prepara la PREVIEW
// - Nessun layout reale
// - Nessuna logica AI
// ======================================================

import { useConfigurationSetupStore } from "../../../../../lib/store/configurationSetup.store";
import { OpeningHoursDay } from "../../../../../components/openingHours/OpeningHoursDay";
  
const DAYS = [
    ["monday", "Lunedì"],
    ["tuesday", "Martedì"],
    ["wednesday", "Mercoledì"],
    ["thursday", "Giovedì"],
    ["friday", "Venerdì"],
    ["saturday", "Sabato"],
    ["sunday", "Domenica"],
  ] as const;

type StepContentProps = {
  onNext: () => void;
  onBack: () => void;
};

export default function StepContent({
  onNext,
  onBack,
}: StepContentProps) {
  const { data, setField } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Contenuti del sito</h2>

      {/* =========================
         DESCRIZIONE ATTIVITÀ
         → usata in HERO / ABOUT
      ========================= */}
      <textarea
        placeholder="Descrivi brevemente la tua attività"
        value={data.description ?? ""}
        onChange={(e) =>
          setField("description", e.target.value)
        }
      />

      {/* =========================
         SERVIZI / PRODOTTI
         → usato nella sezione servizi
      ========================= */}
      <textarea
        placeholder="Elenca i servizi o prodotti principali"
        value={data.services ?? ""}
        onChange={(e) =>
          setField("services", e.target.value)
        }
      />

      {/* =========================
         CALL TO ACTION
         → bottone principale
      ========================= */}
      <input
        placeholder="Call to action (es. Contattaci ora)"
        value={data.cta ?? ""}
        onChange={(e) =>
          setField("cta", e.target.value)
        }
      />

     
{/* =========================
    ORARI DI LAVORO
    → struttura FE-only, AI-friendly
========================= */}

              <h3>Orari di apertura</h3>

              {DAYS.map(([dayKey, dayLabel]) => (
        <OpeningHoursDay
          key={dayKey}
          dayKey={dayKey}
          dayLabel={dayLabel}
          value={data.openingHours?.[dayKey] ?? ""}
          onChange={(value) =>
            setField("openingHours", {
              ...data.openingHours,
              [dayKey]: value,
            })
          }
        />
      ))}


      {/* =========================
         AZIONI
      ========================= */}
      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={onNext}>Continua</button>
      </div>
    </div>
  );
}
