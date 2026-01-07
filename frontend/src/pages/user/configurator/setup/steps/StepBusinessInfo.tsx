// ======================================================
// FE || pages/user/configurator/setup/steps/StepBusinessInfo.tsx
// ======================================================
//
// AI-SUPERCOMMENT — STEP BUSINESS INFO
//
// RUOLO:
// - Raccolta dati base dell’attività
// - Selezione settore (industry)
//
// SOURCE OF TRUTH:
// - industries PROVENGONO dalla Solution (backend)
//
// INVARIANTI:
// - Il settore NON è globale
// - Il settore dipende SEMPRE dalla solution scelta
// - Nessuna fetch API in questo step
//
// NON FA:
// - NON chiama backend
// - NON valida dominio
// - NON crea configurazioni
//
// CONNECT POINT:
// - ConfigurationSetupPage → StepBusinessInfo
// - solution.industries (BE)
//
// ======================================================

import { useConfigurationSetupStore } from "../configurationSetup.store";
import { useEffect } from "react";

export default function StepBusinessInfo({
  onNext,
  configuration,
  industries,
}: {
  onNext: () => void;

  industries: string[]; // ⬅️ dichiarate dal backend (Solution)

  configuration?: {
    business?: {
      name: string;
      type?: string;
    };
  };
}) {
  const { data, setField } = useConfigurationSetupStore();

  /* ======================================================
     PREFILL — SOLO PRIMA ENTRATA
     PERCHE:
     - Utente loggato
     - Configurazione già esistente
  ====================================================== */
  useEffect(() => {
    if (!configuration?.business) return;
  
    // Prefill nome attività
    if (!data.businessName) {
      setField("businessName", configuration.business.name);
    }
  
    /**
     * SETTORE:
     * - deve essere SEMPRE uno degli industries della solution
     * - se il valore legacy non è valido → NON lo settiamo
     */
    if (!data.sector && configuration.business.type) {
      if (industries.includes(configuration.business.type)) {
        setField("sector", configuration.business.type);
      }
    }
  }, [configuration, industries]);
  
  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="step">
      <h2>Informazioni attività</h2>

      {/* ================= NOME ATTIVITÀ ================= */}
      <input
        placeholder="Nome attività"
        value={data.businessName ?? ""}
        onChange={(e) =>
          setField("businessName", e.target.value)
        }
      />

      {/* ================= SETTORE (INDUSTRY) =================
          NOTE:
          - options generate dalla solution
          - backend = source of truth
      ====================================================== */}
 <select
  value={data.sector ?? ""}
  onChange={(e) => setField("sector", e.target.value)}
>
  <option value="">Seleziona settore</option>

  {industries.map((id) => (
    <option key={id} value={id}>
      {id}
    </option>
  ))}
</select>

      {/* ================= CITTÀ ================= */}
      <input
        placeholder="Città"
        value={data.city ?? ""}
        onChange={(e) => setField("city", e.target.value)}
      />

      {/* ================= EMAIL ================= */}
      <input
        placeholder="Email di contatto"
        value={data.email ?? ""}
        onChange={(e) => setField("email", e.target.value)}
      />

      {/* ================= AZIONE ================= */}
      <button onClick={onNext}>
        Continua
      </button>
    </div>
  );
}
