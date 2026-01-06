/* ======================================================
   FE || ADMIN — OPTION EDIT (MONTHLY ONLY)
======================================================

AI-SUPERCOMMENT

RUOLO:
- Creazione e modifica di una Option (entità globale)
- Usata dai Product tramite optionIds
- Salvata in KV dedicata (Option KV)

DECISIONE DI DOMINIO (NON NEGOZIABILE):
- Le Option sono SEMPRE:
  - ricorrenti
  - mensili
- NON esistono più:
  - una tantum
  - annuali
  - scelte di pagamento lato admin

PERCHE (ARCHITETTURA):
- Riduce ambiguità tra Admin / BE / FE
- Il FE pubblico lavora solo con:
  type = "monthly"
- Il carrello somma solo canoni mensili

PERCHE (UX / BUSINESS):
- Le option rappresentano servizi aggiuntivi
- Devono essere semplici, prevedibili, scalabili

REGOLE:
- payment è HARD-CODED
- UI Admin NON espone selettori pagamento
- Il BE valida e accetta SOLO monthly

====================================================== */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminFetch } from "../../../../lib/adminApi/client";

/* =========================
   DTO ADMIN — OPTION
   (MONTHLY ONLY)
========================= */
type AdminOptionDTO = {
  id: string;
  name: string;
  description: string;
  price: number;
  payment: {
    mode: "recurring";
    interval: "monthly";
  };
  status: "ACTIVE" | "ARCHIVED";
};

export default function AdminEditOptionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [option, setOption] = useState<AdminOptionDTO | null>(null);
  const [saving, setSaving] = useState(false);

  /* =========================
     LOAD / INIT OPTION
  ========================= */
  useEffect(() => {
    // NUOVA OPZIONE
    if (isNew) {
      setOption({
        id: "",
        name: "",
        description: "",
        price: 0,
        payment: {
          mode: "recurring",
          interval: "monthly",
        },
        status: "ACTIVE",
      });
      return;
    }

    // MODIFICA OPZIONE ESISTENTE
    adminFetch<{ ok: true; option: AdminOptionDTO }>(
      `/api/admin/option?id=${id}`
    ).then((res) =>
      // HARD OVERRIDE payment → monthly (safety)
      setOption({
        ...res.option,
        payment: {
          mode: "recurring",
          interval: "monthly",
        },
      })
    );
  }, [id, isNew]);

  /* =========================
     SAVE OPTION
  ========================= */
  async function save() {
    if (!option) return;

    setSaving(true);

    await adminFetch("/api/admin/options/register", {
      method: "PUT",
      body: JSON.stringify(option),
    });

    navigate("/admin/options");
  }

  /* =========================
     GUARD
  ========================= */
  if (!option) return <p>Caricamento…</p>;

  /* =========================
     RENDER
  ========================= */
  return (
    <section className="admin-page">
      <h1>{isNew ? "Nuova opzione" : "Modifica opzione"}</h1>

      {/* ================= ID ================= */}
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

      {/* ================= NAME ================= */}
      <label>
        Nome
        <input
          value={option.name}
          onChange={(e) =>
            setOption({ ...option, name: e.target.value })
          }
        />
      </label>

      {/* ================= DESCRIPTION ================= */}
      <label>
        Descrizione
        <textarea
          value={option.description}
          onChange={(e) =>
            setOption({ ...option, description: e.target.value })
          }
        />
      </label>

      {/* ================= PRICE ================= */}
      <label>
        Prezzo mensile (€ / mese)
        <input
          type="number"
          min={0}
          value={option.price}
          onChange={(e) =>
            setOption({
              ...option,
              price: Number(e.target.value),
            })
          }
        />
      </label>

      {/* ================= STATUS ================= */}
      <label>
        Stato
        <div className="wd-select-wrapper">
          <select
            value={option.status}
            onChange={(e) =>
              setOption({
                ...option,
                status: e.target.value as "ACTIVE" | "ARCHIVED",
              })
            }
          >
            <option value="ACTIVE">Attiva</option>
            <option value="ARCHIVED">Archiviata</option>
          </select>
        </div>
      </label>

      {/* ================= ACTION ================= */}
      <button onClick={save} disabled={saving}>
        {saving ? "Salvataggio…" : "Salva"}
      </button>
    </section>
  );
}
