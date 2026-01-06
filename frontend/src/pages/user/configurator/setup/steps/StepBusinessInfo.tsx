// ======================================================
// FE || pages/user/business/setup/steps/<StepName>.tsx
// ======================================================
// ORDER SETUP — STEP
//
// RUOLO:
// - Raccolta dati specifici step
//
// RESPONSABILITÀ:
// - Input controllati
// - Scrittura nello store setup
//
// NON FA:
// - NON naviga globalmente
// - NON chiama backend (tranne Review)
//
// NOTE:
// - Stateless rispetto all’ordine globale
// ======================================================

import { useConfigurationSetupStore } from "../configurationSetup.store";
import { useEffect
 } from "react";

 
export default function StepBusinessInfo({
    onNext,
    configuration,
  }: {
    onNext: () => void;
    configuration?: {
      business?: {
        name: string;
        type?: string;
      };
    };
  }) {
    const { data, setField } = useConfigurationSetupStore();
  
    // 🧠 PREFILL UNA VOLTA SOLA
    useEffect(() => {
      if (!configuration?.business) return;
  
      if (!data.businessName) {
        setField("businessName", configuration.business.name);
      }
  
      if (!data.sector && configuration.business.type) {
        setField("sector", configuration.business.type);
      }
    }, [configuration]);
  
    return (
      <div className="step">
        <h2>Informazioni attività</h2>
  
        <input
          placeholder="Nome attività"
          value={data.businessName ?? ""}
          onChange={(e) =>
            setField("businessName", e.target.value)
          }
        />
  
        <input
          placeholder="Settore"
          value={data.sector ?? ""}
          onChange={(e) => setField("sector", e.target.value)}
        />
  
        <input
          placeholder="Città"
          value={data.city ?? ""}
          onChange={(e) => setField("city", e.target.value)}
        />
  
        <input
          placeholder="Email di contatto"
          value={data.email ?? ""}
          onChange={(e) => setField("email", e.target.value)}
        />
  
        <button onClick={onNext}>Continua</button>
      </div>
    );
  }
  
