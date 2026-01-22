// ======================================================
// FE || pages/user/dashboard/layout/Sidebar.tsx
// ======================================================
//
// AI-SUPERCOMMENT — DASHBOARD SIDEBAR
//
// RUOLO:
// - Navigazione primaria area utente
// - Route-driven (NavLink)
// - Nessuno stato locale
//
// INVARIANTI:
// - Sidebar sempre visibile
// - Evidenzia sezione attiva
// - Nessuna logica business
// ======================================================
// ======================================================
// FE || pages/user/dashboard/layout/Sidebar.tsx
// ======================================================
//
// DASHBOARD SIDEBAR
//
// RUOLO:
// - Navigazione area utente
// - SOLO NavLink (no stato interno)
//
// INVARIANTI:
// - Nessuna logica business
// - Nessun onSelect
// - Nessun useState
// ======================================================

import { NavLink } from "react-router-dom";
import { useMyConfigurations , useMyWorkspaceConfigurations} from "../configurator/api/useMyConfigurations";
import { useActiveProductsWithOptions } from "../configurator/api/useActiveProducts";
import { useMyBusinesses } from "../configurator/api/useMyBusinessDrafts";

/* =========================
   TYPES
========================= */
type SidebarItem = {
  to: string;
  label: string;
  disabled?: boolean;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

/* =========================
   MENU CONFIG
========================= *
 * NOTE UX:
 * - Manteniamo className e struttura DOM identici.
 * - Aggiorniamo solo semantica label (power money).
 * - Le route non esistenti restano disabled (no 404).
 */
const SECTIONS: SidebarSection[] = [
  {
    title: "You On Day , We On Day , Web On Day ",
    items: [
      { to: "/user/dashboard", label: "" },
      { to: "/user/dashboard/business", label: "" },
      { to: "/user/dashboard/user", label: "",  },
    ],
  },
  {
    title: "Business",
    items: [] // popolato dinamicamente
  },
  {
    title: "Workspace",
    items: [
      {
        to: "/user/dashboard/workspace/:id",
        label: "Set Up ",
      },
      {
        to: "/user/dashboard/workspace/weby",
        label: "Weby Engine Dev",
      },
      {
        to: "/user/dashboard/workspace/web-ai",
        label: "Weby + Ai",
      },
    ],
  },
  {
    title: "DriveIn",
    items: [
      { to: "/user/dashboard/orders", label: "Ordini" },
      { to: "/user/dashboard/orders", label: "Token" },
      { to: "/user/dashboard/orders", label: "Referral" }],
  },
  {
    title: "Plans",
    items: [
      { to: "/user/dashboard/plans", label: "Abbonamenti (Pro)", disabled: true },
    ],
  },
  {
    title: "Settings",
    items: [
      { to: "/user/dashboard/settings", label: "Impostazioni", disabled: true },
    ],
  },
];

export default function Sidebar() {
  const { items } = useMyConfigurations();
  const { products } = useActiveProductsWithOptions();
  const { items: workspaceItems } = useMyWorkspaceConfigurations();
  console.log("[SIDEBAR][WORKSPACE]", workspaceItems);
  const {completed , inProgress} = useMyBusinesses();

  return (

    <aside className="dashboard-sidebar">
      
      {SECTIONS.map((section) => (
        <div key={section.title} className="sidebar-section">
          <h4 className="sidebar-title">{section.title}</h4>

          <ul>
            {section.items.map((item) => (
              <li key={item.to}>
                {item.disabled ? (
                  <span className="sidebar-link disabled">{item.label}</span>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
        
      ))}
      {/* =========================
         CONFIGURATIONS (DINAMICHE)
      ========================= */}
      <div className="sidebar-section">
        <h4 className="sidebar-title">Configurations</h4>

        <ul>
          {items.length > 0 ? (
            items.map((config) => (
              <li key={config.id}>
                <NavLink
                  to={`/user/dashboard/workspace/${config.id}`}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  {config.prefill?.businessName || "Nuova attività"}
                </NavLink>
              </li>
            ))
          ) : (
            <li>
              <NavLink to="/solution" className="sidebar-link">
                Inizia una configurazione →
              </NavLink>
            </li>
          )}
        </ul>
      </div>
       {/* =========================
         PLANS (DINAMICI)
         - prodotti attivi dal BE
         - solo nome
         - disabled (teaser / upgrade)
      ========================= */}
      <div className="sidebar-section">
        <h4 className="sidebar-title">Plans</h4>

        <ul>
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.id}>
                <span className="sidebar-link">
                  {product.name}
                </span>
              </li>
            ))
          ) : (
            <li>
              <span className="sidebar-link disabled">
                Nessun piano disponibile
              </span>
            </li>
          )}
        </ul>
      </div>
      {/* =========================
   YOUR BUSINESS (PREVIEW)
========================= */}
<div className="sidebar-section">
  <h4 className="sidebar-title">Business</h4>

  <ul>
  <h4 className="sidebar-title">Business</h4>

<ul>
  {completed.length > 0 ? (
    completed.map(b => (
      <li key={b.configurationId}>
        <NavLink
          to={`/user/dashboard/business/${b.configurationId}`}
        >
          {b.businessName}
        </NavLink>
      </li>
    ))
  ) : (
    <li>
      <span className="sidebar-link disabled">
        Nessuna attività completa
      </span>
    </li>
  )}
</ul>

  </ul>
</div>


    </aside>
  );
}
