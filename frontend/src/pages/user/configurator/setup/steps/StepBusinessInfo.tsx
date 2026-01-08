// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// STEP 1 — BUSINESS CHECKOUT
//
// RUOLO:
// - Raccolta dati minimi dell’attività
// - Primo onboarding dopo carrello/login
//
// NOTE:
// - Form volutamente semplice
// - Nessuna validazione
// - Nessuna persistenza backend
// - Solo Zustand store
// ======================================================

import { useConfigurationSetupStore } from "../configurationSetup.store";

type StepBusinessInfoProps = {
  onNext: () => void;
};

export default function StepBusinessInfo({ onNext }: StepBusinessInfoProps) {
  const { data, setField } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>
        Iniziamo la configurazione per il tuo business
      </h2>

      {/* ================= NOME ATTIVITÀ ================= */}
      <input
        placeholder="Nome attività"
        value={data.businessName ?? ""}
        onChange={(e) =>
          setField("businessName", e.target.value)
        }
      />

      {/* ================= EMAIL (PRECOMPILATA) ================= */}
      <input
        placeholder="Email"
        value={data.email ?? ""}
        disabled
      />

      {/* ================= TELEFONO ================= */}
      <input
        placeholder="Numero di telefono"
        value={data.phone ?? ""}
        onChange={(e) =>
          setField("phone", e.target.value)
        }
      />

      {/* ================= CONSENSO PRIVACY ================= */}
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

      {/* ================= INDIRIZZO ================= */}
      <input
        placeholder="Indirizzo attività"
        value={data.address ?? ""}
        onChange={(e) =>
          setField("address", e.target.value)
        }
      />

      {/* ================= CITTÀ ================= */}
      <input
        placeholder="Città"
        value={data.city ?? ""}
        onChange={(e) =>
          setField("city", e.target.value)
        }
      />

      {/* ================= STATO / PROVINCIA ================= */}
      <input
        placeholder="Stato / Provincia"
        value={data.state ?? ""}
        onChange={(e) =>
          setField("state", e.target.value)
        }
      />

      {/* ================= CAP ================= */}
      <input
        placeholder="CAP"
        value={data.zip ?? ""}
        onChange={(e) =>
          setField("zip", e.target.value)
        }
      />
    {/* ================= IMMAGINE ATTIVITÀ (OPZIONALE) ================= */}
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
      {/* ================= AZIONI ================= */}
      <div className="actions">
        <button onClick={onNext}>
          Continua
        </button>
      </div>
    </div>
  );
}
