// ======================================================
// FE || COMPONENT — OWNER FORM (MINIMAL)
// ======================================================

import { useState, useEffect } from "react";

/* ======================================================
   TYPES
====================================================== */
export type OwnerFormState = {
  firstName: string;
  lastName: string;
  birthDate?: string;
  secondaryMail?: string;
};

type Props = {
  initialState: OwnerFormState;
  businessEmail?: string;
  businessPhone?: string;
  onSubmit: (state: OwnerFormState) => void;
  onBack: () => void;
};

/* ======================================================
   COMPONENT
====================================================== */
export default function OwnerForm({
  initialState,
  businessEmail,
  businessPhone,
  onSubmit,
  onBack,
}: Props) {
  const [form, setForm] =
    useState<OwnerFormState>(initialState);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    console.log("[OWNER_FORM][INIT]", initialState);
  }, [initialState]);

  function set<K extends keyof OwnerFormState>(
    key: K,
    value: OwnerFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit() {
    setError(null);

    if (!form.firstName.trim()) {
      setError("Inserisci il nome");
      return;
    }

    if (!form.lastName.trim()) {
      setError("Inserisci il cognome");
      return;
    }

    onSubmit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      birthDate: form.birthDate,
      secondaryMail:
        form.secondaryMail?.trim() || undefined,
    });
  }

  return (
    <div className="step">
      <h2>Dati del titolare</h2>

      <input
        placeholder="Nome"
        value={form.firstName}
        onChange={(e) =>
          set("firstName", e.target.value)
        }
      />

      <input
        placeholder="Cognome"
        value={form.lastName}
        onChange={(e) =>
          set("lastName", e.target.value)
        }
      />

      <input
        type="date"
        value={form.birthDate ?? ""}
        onChange={(e) =>
          set("birthDate", e.target.value)
        }
      />

      <label>Email attività</label>
      <input value={businessEmail ?? ""} disabled />

      <label>Telefono attività</label>
      <input value={businessPhone ?? ""} disabled />

      <input
        placeholder="Email secondaria (opzionale)"
        value={form.secondaryMail ?? ""}
        onChange={(e) =>
          set("secondaryMail", e.target.value)
        }
      />

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button onClick={onBack}>
          Indietro
        </button>
        <button onClick={handleSubmit}>
          Continua
        </button>
      </div>
    </div>
  );
}
