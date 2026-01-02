import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminFetch } from "../../../../lib/adminApi/client";

type AdminOptionDTO = {
    id: string;
    name: string;
    description: string;
    price: number;
    payment: {
      mode: "one_time" | "recurring";
      interval?: "monthly" | "yearly";
    };
    status: "ACTIVE" | "ARCHIVED";
  };

export default function AdminEditOptionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [option, setOption] = useState<AdminOptionDTO | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) {
        setOption({
          id: "",
          name: "",
          description: "",
          price: 0,
          payment: {
            mode: "one_time",
          },
          status: "ACTIVE",
        });
        return;
      }
      

    adminFetch<{ ok: true; option: AdminOptionDTO }>(
      `/api/admin/option?id=${id}`
    ).then((res) => setOption(res.option));
  }, [id, isNew]);

  async function save() {
    if (!option) return;

    setSaving(true);

    await adminFetch("/api/admin/options/register", {
      method: "PUT",
      body: JSON.stringify(option),
    });

    navigate("/admin/options");
  }

  if (!option) return <p>Caricamento…</p>;

  return (
    <section className="admin-page">
      <h1>{isNew ? "Nuova opzione" : "Modifica opzione"}</h1>

      <label>
        ID
        <input
          value={option.id}
          disabled={!isNew}
          onChange={(e) =>
            setOption({
              ...option,
              id: e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, ""),
            })
          }
        />
      </label>

      <label>
        Nome
        <input
          value={option.name}
          onChange={(e) =>
            setOption({ ...option, name: e.target.value })
          }
        />
      </label>
      <label>
  Descrizione
  <textarea
    value={option.description}
    onChange={(e) =>
      setOption({ ...option, description: e.target.value })
    }
  />
</label>

<label>
  Tipo pagamento
  <div className="wd-select-wrapper">
    <select
      value={option.payment.mode}
      onChange={(e) =>
        setOption({
          ...option,
          payment:
            e.target.value === "one_time"
              ? { mode: "one_time" }
              : { mode: "recurring", interval: "yearly" },
        })
      }
    >
      <option value="one_time">Una tantum</option>
      <option value="recurring">Ricorrente</option>
    </select>
  </div>
</label>

{option.payment.mode === "recurring" && (
  <label>
    Frequenza
    <div className="wd-select-wrapper">
    <select
      value={option.payment.interval}
      onChange={(e) =>
        setOption({
          ...option,
          payment: {
            ...option.payment,
            interval: e.target.value as "monthly" | "yearly",
          },
        })
      }
    >
      <option value="monthly">Mensile</option>
      <option value="yearly">Annuale</option>
    </select>
    </div>
  </label>
)}
      <label>
        Prezzo
        <input
          type="number"
          min={0}
          value={option.price}
          onChange={(e) =>
            setOption({ ...option, price: Number(e.target.value) })
          }
        />
      </label>

      <label>
        Stato
        <div className="wd-select-wrapper">
        <select
          value={option.status}
          onChange={(e) =>
            setOption({
              ...option,
              status: e.target.value as any,
            })
          }
        >
          <option value="ACTIVE">Attiva</option>
          <option value="ARCHIVED">Archiviata</option>
        </select>
        
        </div>
      </label>

      <button onClick={save} disabled={saving}>
        Salva
      </button>
    </section>
  );
}
