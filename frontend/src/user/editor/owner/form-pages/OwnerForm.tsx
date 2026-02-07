// ======================================================
// FE || OWNER FORM (CANONICAL, STORE-DRIVEN)
// ======================================================
import { useConfigurationSetupStore } from "@src/user/editor/api/type/configurator/configurationSetup.store";
import { apiFetch } from "../../../../shared/lib/api";
import { useCityAutocomplete } from "@shared/lib/geo/useCityAutocomplete";

export default function OwnerForm({

  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { data, setField } = useConfigurationSetupStore();
const { suggestions, hasSuggestions } =
  useCityAutocomplete(data.ownerAddress?.city ?? "");
  
  
  
  
  
  async function handleSubmit() {
    if (!data.ownerFirstName?.trim()) {
      alert("Inserisci il nome");
      return;
    }

    if (!data.ownerLastName?.trim()) {
      alert("Inserisci il cognome");
      return;
    }

    if (
      !data.ownerAddress?.street?.trim() ||
      !data.ownerAddress?.number?.trim() ||
      !data.ownerAddress?.city?.trim()
    ) {
      alert("Completa indirizzo, numero civico e città");
      return;
    }
    const payload = {
      configurationId: data.configurationId,
      firstName: data.ownerFirstName,
      lastName: data.ownerLastName,
      birthDate: data.ownerBirthDate || undefined,
      address: data.ownerAddress &&
        Object.values(data.ownerAddress).some(Boolean)
          ? data.ownerAddress
          : undefined,
      contact: {
        phoneNumber: data.ownerPhone || undefined,
      },
    };
    // NOTA:
    // - Questa operazione NON crea Owner
    // - Scrive solo OwnerDraft
    // - La creazione Owner avviene SOLO via attachOwnerToConfiguration

    await apiFetch("/api/owner/create", {
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
      placeholder="Telefono"
      value={data.ownerPhone ?? ""}
      onChange={(e) =>
        setField("ownerPhone", e.target.value)} />

{/* ================= INDIRIZZO TITOLARE ================= */}
<div className="address-block owner-address">

  <label className="field">
    <span>Via / Indirizzo *</span>
    <input
      value={data.ownerAddress?.street ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          street: e.target.value,
        })
      }
    />
  </label>

    <label className="field">
    <span>Numero civico *</span>
      <input
      value={data.ownerAddress?.number ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          number: e.target.value,}) } />
  </label>

  {/* === CITTÀ CON AUTOCOMPLETE === */}
  <label className="field city-autocomplete">
    <span>Città *</span>
    <input
      value={data.ownerAddress?.city ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          city: e.target.value,
        })
      }
    />

    {hasSuggestions && (
      <ul className="autocomplete-list">
        {suggestions.map((c) => (
          <li
            key={c.city}
            onClick={() => {
              setField("ownerAddress", {
                ...data.ownerAddress,
                city: c.city,
                province: c.province,
                region: c.region,   // FE-only
                country: c.state,   // FE-only
              });
            }}
          >
            <strong>{c.city}</strong>
            <span>
              {c.province} – {c.region}
            </span>
          </li>
        ))}
      </ul>
    )}
  </label>

  <label className="field">
    <span>Provincia</span>
    <input
      value={data.ownerAddress?.province ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          province: e.target.value,
        })
      }
    />
  </label>

  <label className="field">
    <span>Regione</span>
    <input
      value={data.ownerAddress?.region ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          region: e.target.value,
        })
      }
    />
  </label>

  <label className="field">
    <span>CAP</span>
    <input
      value={data.ownerAddress?.zip ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          zip: e.target.value,
        })
      }
    />
  </label>

  <label className="field">
        <span>Stato</span>
        <input
          value={data.ownerAddress?.country ?? "Italia"}
          onChange={(e) =>
            setField("ownerAddress", {
          ...data.ownerAddress,
          country: e.target.value,})
          }/>
  </label>
          </div>
            <div className="actions">
              <button onClick={onBack}>Indietro</button>
              <button onClick={handleSubmit}>Continua</button>
            </div>
          </div> );
}
