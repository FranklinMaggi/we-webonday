import { useConfigurationSetupStore } from "../../store/configurationSetup.store";

export default function StepComplete() {
  const { data } = useConfigurationSetupStore();

  const configurationId = data.configurationId;

  return (
    <div className="step step-complete">
      <h2>Configurazione completata 🎉</h2>

      <p>
        Il tuo business è stato configurato correttamente.
      </p>

      <p>
        Da ora in poi lo troverai nella sezione <strong>Business</strong>.
      </p>

      <p className="note">
        La configurazione non è più modificabile finché il sito
        non viene rimesso in modalità modifica.
      </p>

      <div className="actions">
        <button
          className="wd-btn-primary"
          onClick={() =>{
            window.location.href = `/user/dashboard/business/${configurationId}`;
          }
          }
        >
          Vai al tuo business →
        </button>
      </div>
    </div>
  );
}
