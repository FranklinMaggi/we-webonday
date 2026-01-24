// ======================================================
// FE || USER DASHBOARD || INDEX
// ======================================================
//
// RUOLO:
// - Entry point Dashboard
// - Collega Container → View
//
// ======================================================

import { useDashboardContainer } from "./Dashboard.container";
import { DashboardView } from "./Dashboard.view";

export default function UserDashboardHome() {
  const vm = useDashboardContainer();
  return <DashboardView {...vm} />;
}
