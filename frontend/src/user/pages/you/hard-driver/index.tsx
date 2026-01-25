// ======================================================
// FE || USER DASHBOARD || YOU — INDEX
// ======================================================
//
// RUOLO:
// - Entry point pagina /dashboard/you
// - Collega Container → View
//
// ======================================================

import { useYouDashboardContainer } from "./You.container";
import { YouDashboardView } from "./You.view";

export default function YouDashboardPage() {
  const vm = useYouDashboardContainer();
  return <YouDashboardView {...vm} />;
}
