// ======================================================
// FE || STEP || StepComplete
// ======================================================
//
// RUOLO:
// - Chiusura configurazione guidata
// - Redirect al Business SENZA hard reload
//
// PERCHÉ:
// - window.location.href distrugge React + Zustand
// - causa fetch infiniti e sidebar incoerente
//
// ======================================================

import { useNavigate } from "react-router-dom";
import { useConfigurationSetupStore }from "@shared/domain/user/configurator/configurationSetup.store"
export default function StepComplete() {
  const navigate = useNavigate();
  const { data } = useConfigurationSetupStore();

  const configurationId = data.configurationId;

  // SAFETY: se manca ID non navighiamo
  if (!configurationId) {
    return (
      <div className="step step-complete">
        <h2>Configurazione completata</h2>
        <p>Stiamo finalizzando il tuo business…</p>
      </div>
    );
  }

  return (
    <div className="step step-complete">
      <h2>Configurazione completata 🎉</h2>

      <p>Il tuo business è stato configurato correttamente.</p>

      <p>
        Da ora in poi lo troverai nella sezione{" "}
        <strong>Business</strong>.
      </p>

      <p className="note">
        La configurazione non è più modificabile finché il sito
        non viene rimesso in modalità modifica.
      </p>

      <div className="actions">
        <button
          className="wd-btn-primary"
          onClick={() => {
            navigate(
              `/user/dashboard/business/${configurationId}`,
              { replace: true }
            );
          }}
        >
          Vai al tuo business →
        </button>
      </div>
    </div>
  );
}
