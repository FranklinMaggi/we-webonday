// ======================================================
// FE || pages/user/layout/ConfigurationLayout.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION WORKSPACE LAYOUT
//
// RUOLO:
// - Layout editor configurazione persistente
// - Sidebar contestuale (NON dashboard)
//
// SOURCE OF TRUTH:
// - Stato locale (useState)
//
// COSA FA:
// - Switch sezioni workspace
//
// COSA NON FA:
// - NON usa DashboardSideBar
// - NON usa routing
//
// INVARIANTI:
// - Sidebar = locale, non NavLink
//
// ======================================================
import { useState } from "react";
import ConfiguratorSidebar, { type StepId } from "./ConfiguratorSidebar";
import BusinessForm from "./workspace/forms/BusinessForm";
import type { ConfigurationDTO } from "../../../lib/apiModels/user/Configuration.api-model";

export default function ConfigurationLayout({
  configuration,
}: {
  configuration: ConfigurationDTO;
}) {
  const [section, setSection] = useState<StepId>("business");

  return (
    <div className="configuration-workspace">
      <ConfiguratorSidebar
        active={section}
        onSelect={setSection}
      />

      <main className="configuration-main">
        {section === "business" && (
          <BusinessForm configuration={configuration} />
        )}
      </main>
    </div>
  );
}
