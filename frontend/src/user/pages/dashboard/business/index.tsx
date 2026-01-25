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
// - configurationId NON è garantito dal BE (per ora)
//
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyBusinesses } from "@src/user/configurator/api/business.user.api";

/* =========================
   VIEW MODEL (FE)
========================= */
type BusinessSummaryVM = {
  businessId: string;
  name: string;
  status: string;
  createdAt: string;
  configurationId: string;
};

export default function UserBusinessDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState<BusinessSummaryVM[]>([]);
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

        /**
         * 🔧 MAPPING DIFENSIVO (PROVVISORIO)
         *
         * FINCHÉ IL BE NON ESPONE configurationId:
         * - proviamo a ricavarlo
         * - oppure SKIPPIAMO l’editing
         */
        const mapped: BusinessSummaryVM[] = res.items
          .filter((b: any) => b.configurationId) // ← se NON c’è, niente editing
          .map((b: any) => ({
            businessId: b.businessId,
            name: b.name,
            status: b.status,
            createdAt: b.createdAt,
            configurationId: b.configurationId,
          }));

        setItems(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  /* =====================
     UI STATES
  ====================== */
  if (loading) return <p>Caricamento…</p>;
  if (items.length === 0)
    return <p>Nessuna attività modificabile.</p>;

  /* =====================
     HANDLERS
  ====================== */
  function goToConfigurator(configurationId: string) {
    navigate(`/user/dashboard/configurator/${configurationId}`)
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
