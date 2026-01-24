// ======================================================
// FE || USER DASHBOARD || SHELL (ROUTING LAYOUT)
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Layout strutturale area Dashboard Utente
// - Sidebar persistente
// - Content dinamico via <Outlet />
//
// SOURCE:
// - React Router (nested routes)
//
// NON FA:
// - Fetch dati
// - Logica business
// - Autenticazione
//
// CONNECT POINT:
// - sidebar/Sidebar.container.tsx
// - Tutte le route /user/dashboard/*
//
// ======================================================

import { Outlet } from "react-router-dom";
import SidebarContainer from "./sidebar/Sidebar.container";

export default function UserDashboardShell() {
  return (
    <div className="user-dashboard-shell">
      <SidebarContainer />

      <main className="user-dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
