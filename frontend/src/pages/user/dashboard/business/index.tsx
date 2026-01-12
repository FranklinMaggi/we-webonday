// ======================================================
// FE || pages/user/dashboard/business/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER BUSINESS LIST (CANONICAL)
//
// RUOLO:
// - Elenco attività dell’utente
// - HUB di navigazione (NON editor)
//
// INVARIANTE CRITICA:
// - Ogni editing porta SEMPRE a:
//   /user/configurator/:configurationId
//
// NOTE:
// - businessId ≠ configurationId
// - Editing ≠ Visualizzazione
//
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyBusinesses } from "../../../../lib/userApi/business.user.api";

/* =========================
   TYPES (VIEW MODEL)
========================= */
type BusinessSummary = {
  businessId: string;
  name: string;
  status: string;
  createdAt: string;

  // ⚠️ PROVVISORIO MA OBBLIGATORIO
  configurationId: string;
};

export default function UserBusinessDashboard() {
  const navigate = useNavigate();

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

        // 🔧 MAPPING DIFENSIVO (PROVVISORIO)
        const mapped: BusinessSummary[] = res.items
          .filter((b: any) => b.configurationId || b.configId)
          .map((b: any) => ({
            businessId: b.businessId ?? b.id,
            name: b.name,
            status: b.status,
            createdAt: b.createdAt,
            configurationId: b.configurationId ?? b.configId,
          }));

        setItems(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  /* =====================
     UI STATES
  ====================== */
  if (loading) return <p>Caricamento…</p>;
  if (items.length === 0) return <p>Nessuna attività creata.</p>;

  /* =====================
     HANDLERS
  ====================== */
  function goToConfigurator(configurationId: string) {
    // 🎯 ENTRY POINT CANONICO
    navigate(`/user/configurator/${configurationId}`);
  }

  function goToBusinessView(businessId: string) {
    navigate(`/user/dashboard/business/${businessId}`);
  }

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
            {/* === EDITING → CONFIGURATOR === */}
            <button
              onClick={() => goToConfigurator(b.configurationId)}
            >
              ✏️ Modifica sito
            </button>

            {/* === VISTA PASSIVA === */}
            <button
              onClick={() => goToBusinessView(b.businessId)}
            >
              👁 Visualizza
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
