// ======================================================
// FE || OWNER FORM (CANONICAL, STORE-DRIVEN)
// ======================================================

import { useConfigurationSetupStore } from "../base_configuration/configuration/configurationSetup.store";
import { apiFetch } from "../../../shared/lib/api";

export default function OwnerForm({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { data, setField } = useConfigurationSetupStore();

  async function handleSubmit() {
    if (!data.ownerFirstName?.trim()) {
      alert("Inserisci il nome");
      return;
    }

    if (!data.ownerLastName?.trim()) {
      alert("Inserisci il cognome");
      return;
    }

    if (!data.ownerPrivacy.accepted) {
      alert("Devi accettare la privacy");
      return;
    }

    const payload = {
      firstName: data.ownerFirstName,
      lastName: data.ownerLastName,
      birthDate: data.ownerBirthDate || undefined,
      contact: {
        secondaryMail: data.ownerSecondaryMail || undefined,
      },
      privacy: {
        ...data.ownerPrivacy,
        subject: "owner",
        source: "owner-form",
      },
    };

    await apiFetch("/api/owner/create-draft", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    onComplete();
  }

  return (
    <div className="step">
      <h2>Dati del titolare</h2>

      <input
        placeholder="Nome"
        value={data.ownerFirstName}
        onChange={(e) =>
          setField("ownerFirstName", e.target.value)
        }
      />

      <input
        placeholder="Cognome"
        value={data.ownerLastName}
        onChange={(e) =>
          setField("ownerLastName", e.target.value)
        }
      />

      <input
        type="date"
        value={data.ownerBirthDate ?? ""}
        onChange={(e) =>
          setField("ownerBirthDate", e.target.value)
        }
      />

      <input
        placeholder="Email secondaria (opzionale)"
        value={data.ownerSecondaryMail ?? ""}
        onChange={(e) =>
          setField("ownerSecondaryMail", e.target.value)
        }
      />

      {/* PRIVACY */}
      <label>
        <input
          type="checkbox"
          checked={data.ownerPrivacy.accepted}
          onChange={(e) =>
            setField("ownerPrivacy", {
              accepted: e.target.checked,
              acceptedAt: e.target.checked
                ? new Date().toISOString()
                : "",
              policyVersion: "v1",
            })
          }
        />
        Accetto il trattamento dei dati personali
      </label>

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={handleSubmit}>Continua</button>
      </div>
    </div>
  );
}
