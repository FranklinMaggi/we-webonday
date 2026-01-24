// ======================================================
// FE || pages/admin/users/index.tsx
// ======================================================
// ADMIN — USERS LIST
//
// RUOLO:
// - Visualizzare utenti registrati
//
// RESPONSABILITÀ:
// - Fetch utenti
// - Rendering tabellare
//
// NON FA:
// - NON modifica utenti
// - NON gestisce ruoli
//
// NOTE:
// - Stato utente interpretato dal backend
// ======================================================

import { useEffect, useState } from "react";
import { getAdminUsers, type AdminUser } from "@admin/adminApi";
import { getWdStatusClass } from "@src/shared/utils/statusUi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminUsers()
      .then((out) => {
        // Se il BE torna array diretto => ok
        // Se il BE torna { ok, users } => vedi punto 3 sotto
        setUsers(out);
      })
      .catch(() => setError("Errore caricamento utenti"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Utenti</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Stato</th>
            <th>Creato il</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>
              <span className={getWdStatusClass(u.status)}>
    {u.status}
  </span>
</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
