// src/pages/admin/activity/index.tsx
import { useEffect, useState } from "react";
import { getAdminActivity } from "../../../lib/adminApi";

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
