// ======================================================
// FE || STEP — OWNER INFO (WRITE-ONLY)
// ======================================================
//
// RUOLO:
// - Raccoglie dati titolare
// - Li invia al BE
// - Non legge nulla
//
// ======================================================


import { useConfigurationSetupStore } from "../../store/configurationSetup.store";
import { createBusinessOwnerDraft } from "../../api/business.owner.api";

import OwnerForm, {
  type OwnerFormState,
} from "../owner/OwnerForm";

/* ======================================================
   COMPONENT
====================================================== */
export default function StepOwnerInfo({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void; 
}) {

  const { data } = useConfigurationSetupStore();

  /* =====================
     HARD GUARDS
  ====================== */
  if (!data.configurationId || !data.businessDraftId) {
    return (
      <div className="step-error">
        Configurazione incompleta
      </div>
    );
  }

  /* =====================
     SUBMIT (WRITE-ONLY)
  ====================== */
  async function handleSubmit(
    state: OwnerFormState
  ) {
    console.log("[STEP_OWNER][SUBMIT]", state);

    const res = await createBusinessOwnerDraft({
      firstName: state.firstName,
      lastName: state.lastName,
      birthDate: state.birthDate,
      
    });

    if (!res.ok) {
      console.error(
        "[STEP_OWNER][ERROR]",
        res.error
      );
      alert("Errore nel salvataggio del titolare");
      return;
    }

    console.log("[STEP_OWNER][OK]");
    onNext(); // 🔑 PASSAGGIO AL COMMIT
    
  }

  /* =====================
     RENDER
  ====================== */
  return (
    <OwnerForm
      initialState={{
        firstName: "",
        lastName: "",
        birthDate: undefined,

      }}
      businessEmail={data.email}
      businessPhone={data.phone}
      onBack={onBack}
      onSubmit={handleSubmit}
    />
  );
}
