// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// STEP — BUSINESS SETUP (ANAGRAFICA + CONTENUTI)
//
// RUOLO:
// - Raccolta completa dei dati del business
// - Include:
//   • anagrafica
//   • contatti
//   • indirizzo
//   • contenuti testuali
//   • orari di apertura
//
// INVARIANTI CRITICHE:
// - FE ONLY (Zustand store)
// - Nessuna fetch
// - Nessuna persistenza backend
// - Nessuna validazione bloccante
// - Nessuna creazione Business / Configuration
//
// SCOPO:
// - Preparare TUTTI i dati necessari
//   allo step successivo (creazione Business BE)
//
// ======================================================

import { useConfigurationSetupStore } from "../../../../../lib/store/configurationSetup.store";
import { OpeningHoursDay } from "../../../../../components/openingHours/OpeningHoursDay";
import { createBusiness } from "../../../../../lib/userApi/business.user.api";
/* =========================
   COSTANTI
========================= */
const DAYS = [
  ["monday", "Lunedì"],
  ["tuesday", "Martedì"],
  ["wednesday", "Mercoledì"],
  ["thursday", "Giovedì"],
  ["friday", "Venerdì"],
  ["saturday", "Sabato"],
  ["sunday", "Domenica"],
] as const;

/* =========================
   PROPS
========================= */
type StepBusinessInfoProps = {
  onNext: () => void;
};

export default function StepBusinessInfo({
  onNext,
}: StepBusinessInfoProps) {
  /**
   * SOURCE OF TRUTH:
   * - data     → stato corrente del wizard (FE)
   * - setField → mutazione atomica di un singolo campo
   */
  const {
    data,
    setField,
    businessId,
    setBusinessId,
  } = useConfigurationSetupStore();
  
  return (
    <div className="step">
      <h2>Configuriamo il tuo business</h2>

      {/* ======================================================
         ANAGRAFICA BUSINESS
      ====================================================== */}
      <input
        placeholder="Nome attività"
        value={data.businessName ?? ""}
        onChange={(e) =>
          setField("businessName", e.target.value)
        }
      />

      <input
        placeholder="Email"
        value={data.email ?? ""}
        disabled
      />

      <input
        placeholder="Numero di telefono"
        value={data.phone ?? ""}
        onChange={(e) =>
          setField("phone", e.target.value)
        }
      />

      <label>
        <input
          type="checkbox"
          checked={data.privacyAccepted ?? false}
          onChange={(e) =>
            setField("privacyAccepted", e.target.checked)
          }
        />
        Accetto il trattamento dei dati personali
      </label>

      {/* ======================================================
         INDIRIZZO BUSINESS (FE-ONLY)
      ====================================================== */}
      <input
        placeholder="Indirizzo attività (es. Via Roma 10)"
        value={data.address ?? ""}
        onChange={(e) =>
          setField("address", e.target.value)
        }
      />

      <div className="address-grid">
        <input
          placeholder="Città"
          value={data.city ?? ""}
          onChange={(e) =>
            setField("city", e.target.value)
          }
        />

        <input
          placeholder="Provincia / Stato"
          value={data.state ?? ""}
          onChange={(e) =>
            setField("state", e.target.value)
          }
        />

        <input
          placeholder="CAP"
          value={data.zip ?? ""}
          onChange={(e) =>
            setField("zip", e.target.value)
          }
        />
      </div>

      {/* ======================================================
         IMMAGINE BUSINESS (FE-ONLY)
      ====================================================== */}
      <label>
        Immagine dell’attività (opzionale)
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setField(
              "businessImage",
              e.target.files?.[0] ?? null
            )
          }
        />
      </label>

      {/* ======================================================
         CONTENUTI SITO
      ====================================================== */}
      <h3>Contenuti del sito</h3>

      <textarea
        placeholder="Descrivi brevemente la tua attività"
        value={data.description ?? ""}
        onChange={(e) =>
          setField("description", e.target.value)
        }
      />

      <textarea
        placeholder="Elenca i servizi o prodotti principali"
        value={data.services ?? ""}
        onChange={(e) =>
          setField("services", e.target.value)
        }
      />

      <input
        placeholder="Call to action (es. Contattaci ora)"
        value={data.cta ?? ""}
        onChange={(e) =>
          setField("cta", e.target.value)
        }
      />

      {/* ======================================================
         ORARI DI APERTURA (FE-ONLY)
      ====================================================== */}
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

      {/* ======================================================
         AZIONE
      ====================================================== */}
    <div className="actions">
    <button
  onClick={async () => {
    // ============================================
    // STEP 2 — CREATE BUSINESS (ONCE)
    // ============================================

    if (!data.businessName) {
      alert("Inserisci il nome dell’attività");
      return;
    }
    
    if (!data.solutionId || !data.productId) {
      alert("Configurazione commerciale mancante");
      return;
    }
    
    if (!businessId) {
      const res = await createBusiness({
        name: data.businessName,
        address: [
          data.address,
          data.city,
          data.state,
          data.zip,
        ].filter(Boolean).join(", "),
        phone: data.phone,
        openingHours: data.openingHours,
    
        solutionId: data.solutionId,
        productId: data.productId,
        optionIds: data.optionIds ?? [],
      });
    
      if (!res || !res.ok) {
        alert("Errore creazione attività");
        return;
      }
    
      // TECH STATE (FE-only)
      setBusinessId(res.businessId);
    }
    
    onNext();
    
  }}
>
  Continua
</button>


</div>

    </div>
  );
}
