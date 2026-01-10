// ======================================================
// FE || pages/user/dashboard/business/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER BUSINESS LIST
//
// RUOLO:
// - Elenco attività dell’utente
//
// SOURCE OF TRUTH:
// - Backend API (listMyBusinesses)
//
// COSA FA:
// - Navigazione verso:
//   • vista passiva
//   • configurator
//
// COSA NON FA:
// - NON modifica business
// - NON crea configurazioni
//
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
  /* =====================
     NAVIGATION
  ====================== */
  const navigate = useNavigate();

  /* =====================
     STATE
  ====================== */
  const [items, setItems] = useState<BusinessSummary[]>([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD BUSINESSES
  ====================== */
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
  

  /* =====================
     UI STATES
  ====================== */
  if (loading) return <p>Caricamento…</p>;
  if (items.length === 0) return <p>Nessuna attività creata.</p>;

  /* =====================
     RENDER
  ====================== */
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

            {/* === VISTA PASSIVA DASHBOARD === */}
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

/* =====================
   TEMP CONFIG NAV
===================== */
function startConfig(
  businessId: string,
  mode: "design" | "content" | "preview"
) {
  // TODO: sostituire con router interno quando pronto
  window.location.href = `/configurator/start?businessId=${businessId}&mode=${mode}`;
}
