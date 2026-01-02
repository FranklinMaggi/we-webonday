// ======================================================
// FE || pages/admin/dashboard/index.tsx
// ======================================================
// ADMIN — DASHBOARD KPI
//
// RUOLO:
// - Overview globale piattaforma
//
// RESPONSABILITÀ:
// - Fetch KPI aggregati
// - Visualizzazione numeri chiave
//
// NON FA:
// - NON modifica dati
// - NON applica filtri complessi
//
// NOTE:
// - Read-only per definizione
// - KPI calcolati esclusivamente dal backend
// ======================================================


import { useEffect, useState } from "react";
import { getAdminKPI } from "../../../lib/adminApi";
import type { AdminKPI } from "../../../lib/adminApi";
import "../orders";

export default function AdminDashboard() {
  const [kpi, setKpi] = useState<AdminKPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminKPI()
      .then((res) => {
        // 👇 FIX CHIAVE: il backend ritorna { ok, kpi }
        setKpi(res.kpi);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento…</p>;
  if (!kpi) return <p>Errore caricamento KPI</p>;

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Ordini</h3>
          <p>{kpi.orders.total}</p>
        </div>

        <div className="kpi-card">
          <h3>In attesa</h3>
          <p>{kpi.orders.pending}</p>
        </div>

        <div className="kpi-card">
          <h3>Fatturato</h3>
          <p>€ {(kpi.revenue?.totalAmount ?? 0).toFixed(2)} €</p>
        </div>

        <div className="kpi-card">
          <h3>Utenti</h3>
          <p>{kpi.users.total}</p>
        </div>
      </div>
    </div>
  );
}
