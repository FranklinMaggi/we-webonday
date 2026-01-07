// ======================================================
// FE || pages/user/dashboard/DashboardLayout.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER DASHBOARD LAYOUT
//
// RUOLO:
// - Layout persistente area utente
// - Sidebar sempre visibile
//
// INVARIANTI:
// - Nessuna logica business
// - Nessun fetch
//
// ======================================================

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar
  active="dashboard"
  onSelect={() => {}}
/>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
