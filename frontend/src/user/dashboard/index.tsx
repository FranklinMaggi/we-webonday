// ======================================================
// FE || USER DASHBOARD || INDEX
// ======================================================
//
// RUOLO:
// - Entry point Dashboard
// - Collega Container → View
//
// ======================================================

import { useDashboardContainer } from "./components/Dashboard.container";
import { DashboardView } from "./components/Dashboard.view";

export default function UserDashboardHome() {
  const vm = useDashboardContainer();
  return <DashboardView {...vm} />;
}
