import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminConfigurationsList,
  type AdminConfiguration,
} from "@src/admin/adminApi/admin.configuration.api";

export default function AdminConfigurationsPage() {
  const [items, setItems] = useState<AdminConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminConfigurationsList()
      .then((res) => setItems(res.configurations))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento…</p>;
  if (!items.length) return <p>Nessuna configurazione</p>;

  return (
    <section className="admin-page">
      <h1>Configurazioni</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Stato</th>
            <th>Creato</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.status}</td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/admin/configurations/${c.id}`)
                  }
                >
                  Apri
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
