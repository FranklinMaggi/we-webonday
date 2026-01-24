// ======================================================
// FE || ADMIN — OPTIONS LIST
// File: src/pages/admin/products/options/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Lista opzioni prodotto (ADMIN)
//
// RESPONSABILITÀ:
// - Fetch lista
// - Navigazione editor
//
// NON FA:
// - NON modifica
// - NON valida dominio
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminFetch } from "@src/admin/adminApi/client";
import { getWdStatusClass } from "@src/shared/utils/statusUi";


type AdminOptionListItem = {
  id: string;
  name: string;
  price: number;
  status: "ACTIVE" | "ARCHIVED";
};

export default function AdminOptionsPage() {
  const [options, setOptions] = useState<AdminOptionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminFetch<{ ok: true; options: AdminOptionListItem[] }>(
      "/api/admin/options/list"
    )
      .then((res) => setOptions(res.options))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento…</p>;

  return (
    <section className="admin-page">
      <h1>Opzioni</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Prezzo</th>
            <th>Stato</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {options.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.name}</td>
              <td>€ {o.price}</td>
              <td>
              <span className={getWdStatusClass(o.status)}>
                  {o.status}
                </span>
              </td>
              <td>
                <button onClick={() => navigate(o.id)}>
                  Modifica
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <button onClick={() => navigate("new")}>
        + Nuova opzione
      </button>
    </section>
  );
}
