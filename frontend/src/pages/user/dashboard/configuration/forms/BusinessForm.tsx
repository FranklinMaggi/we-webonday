// ======================================================
// FE || dashboard/configuration/forms/BusinessForm.tsx
// ======================================================
//
// AI-SUPERCOMMENT — BUSINESS CONFIGURATION FORM
//
// RUOLO:
// - Editing completo dati business
// - Persistenza diretta su backend
//
// INVARIANTI:
// - Configuration = entità persistente
// - Backend = source of truth
// - NO zustand
// - NO wizard
//
// API:
// - PUT /api/configuration/:id
// ======================================================

import { useState } from "react";
import { updateConfiguration } from "../../../../../lib/userApi/configuration.user.api";
import type { ConfigurationDTO } from "../../../../../lib/dto/configurationDTO";


export default function BusinessForm({
  configuration,
}: {
  configuration: ConfigurationDTO;
}) {
  const [form, setForm] = useState({
    name: configuration.business?.name ?? "",
    type: configuration.business?.type ?? "",
    city: configuration.business?.city ?? "",
    email: configuration.business?.email ?? "",
    phone: configuration.business?.phone ?? "",
    description: configuration.business?.description ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(
    key: keyof typeof form,
    value: string
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateConfiguration(configuration.id, {
        business: form,
        status: "draft",
      });

      setSaved(true);
    } catch (e: any) {
      setError(e.message ?? "Errore salvataggio");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="business-form">
      <h2>Informazioni attività</h2>

      <label>
        Nome attività
        <input
          value={form.name}
          onChange={(e) =>
            setField("name", e.target.value)
          }
        />
      </label>

      <label>
        Settore
        <input
          value={form.type}
          onChange={(e) =>
            setField("type", e.target.value)
          }
        />
      </label>

      <label>
        Città
        <input
          value={form.city}
          onChange={(e) =>
            setField("city", e.target.value)
          }
        />
      </label>

      <label>
        Email di contatto
        <input
          value={form.email}
          onChange={(e) =>
            setField("email", e.target.value)
          }
        />
      </label>

      <label>
        Telefono
        <input
          value={form.phone}
          onChange={(e) =>
            setField("phone", e.target.value)
          }
        />
      </label>

      <label>
        Descrizione attività
        <textarea
          value={form.description}
          onChange={(e) =>
            setField("description", e.target.value)
          }
        />
      </label>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {saved && (
        <p style={{ color: "green" }}>
          Modifiche salvate
        </p>
      )}

      <button onClick={save} disabled={saving}>
        {saving ? "Salvataggio…" : "Salva"}
      </button>
    </section>
  );
}
