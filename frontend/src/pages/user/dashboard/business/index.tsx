// ======================================================
// FE || pages/user/dashboard/business/index.tsx
// ======================================================
//
// USER BUSINESS DASHBOARD
//
// RUOLO:
// - Lista business dell’utente
// - Entry point ai flussi di configurazione
//
// ======================================================

import { useEffect, useState } from "react";
import { listMyBusinesses } from "../../../../lib/userApi/business.user.api";

type BusinessSummary = {
  businessId: string;
  publicId: string;
  name: string;
  status: string;
  createdAt: string;
};

export default function UserBusinessDashboard() {
  const [items, setItems] = useState<BusinessSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyBusinesses()
      .then((res) => {
        if (res?.ok) setItems(res.businesses);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento…</p>;
  if (items.length === 0) return <p>Nessuna attività creata.</p>;

  return (
    <section>
      <h2>Le tue attività</h2>

      {items.map((b) => (
        <div key={b.businessId} className="card">
          <h3>{b.name}</h3>
          <p>Stato: {b.status}</p>

          <div className="actions">
            <button onClick={() => startConfig(b.businessId, "design")}>
              🎨 Design
            </button>

            <button onClick={() => startConfig(b.businessId, "content")}>
              ✍️ Contenuti
            </button>

            <button onClick={() => startConfig(b.businessId, "preview")}>
              👁 Preview
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

function startConfig(
  businessId: string,
  mode: "design" | "content" | "preview"
) {
  // per ora navigazione semplice
  window.location.href = `/configurator/start?businessId=${businessId}&mode=${mode}`;
}
