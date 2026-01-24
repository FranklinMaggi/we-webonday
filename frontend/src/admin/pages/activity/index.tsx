// ======================================================
// FE || pages/admin/activity/index.tsx
// ======================================================
// ADMIN — ACTIVITY LOG
//
// RUOLO:
// - Visualizzare log di attività amministrative
//
// RESPONSABILITÀ:
// - Fetch activity log dal backend
// - Rendering tabellare read-only
//
// NON FA:
// - NON filtra o interpreta i log
// - NON modifica stato
// - NON applica permessi
//
// NOTE:
// - Backend decide cosa è loggato
// - FE mostra dati grezzi per audit/debug
// ======================================================

import { useEffect, useState } from "react";
import { getAdminActivity } from "@src/admin/adminApi";

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminActivity()
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento…</p>;

  return (
    <div>
      <h1>Activity Log</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>User</th>
            <th>Dettagli</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{new Date(l.timestamp).toLocaleString()}</td>
              <td>{l.type}</td>
              <td>{l.userId ?? "-"}</td>
              <td>
                <pre style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(l.payload, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
