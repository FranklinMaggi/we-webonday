// ======================================================
// FE || pages/user/dashboard/business/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER BUSINESS LIST (CANONICAL)
//
// RUOLO:
// - Elenco attività dell’utente
// - Entry point UNIFICATO verso il configurator
//
// SOURCE OF TRUTH:
// - Backend API (listMyBusinesses)
//
// INVARIANTE CRITICA:
// - Tutte le azioni di editing
//   portano a /user/configurator/:configurationId
//Il configurator è l’unica interfaccia
//che modifica una Configuration.

//La modalità (wizard / workspace)
//dipende esclusivamente dallo status backend.
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyBusinesses } from "../../../../lib/userApi/business.user.api";

/* =========================
   TYPES
========================= */
type BusinessSummary = {
  businessId: string;
  publicId: string;
  name: string;
  status: string;
  createdAt: string;
};

export default function UserBusinessDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState<BusinessSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyBusinesses()
      .then((res) => {
        if (!res?.ok || !Array.isArray(res.items)) {
          setItems([]);
          return;
        }
        setItems(res.items);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento…</p>;
  if (items.length === 0) return <p>Nessuna attività creata.</p>;

  function goToConfigurator(configurationId: string) {
    navigate(`/user/configurator/${configurationId}`);
  }

  return (
    <section>
      <h2>Le tue attività</h2>

      {items.map((b) => (
        <div key={b.businessId} className="card">
          <h3>{b.name}</h3>
          <p>Stato: {b.status}</p>

          <div className="actions">
            <button onClick={() => goToConfigurator(b.businessId)}>
              🎨 Design
            </button>

            <button onClick={() => goToConfigurator(b.businessId)}>
              ✍️ Contenuti
            </button>

            <button
              onClick={() =>
                navigate(`/user/dashboard/business/${b.businessId}`)
              }
            >
              👁 Visualizza
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
