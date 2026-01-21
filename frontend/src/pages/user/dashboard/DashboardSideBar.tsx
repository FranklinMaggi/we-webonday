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
========================= */
const SECTIONS: SidebarSection[] = [
  {
    title: "Plans",
    items: [
      { to: "productId", label: "Free" },
      { to: "productId", label: "Essential" , disabled: true },//la pagina visibile sempre solo il label effetto disabled , perchè non è attvia la promozione / mostra optionID di productId a destr bottone vicino switcher per attivatre a destra si apre pagina checkout
      { to: "productId", label: "Working", disabled: true },//la pagina visibile sempre solo il label effetto disabled , perchè non è attvia la promozione / mostra optionID di productId a destr bottone vicino switcher per attivatre a destra si apre pagina checkout
      { to: "productId", label: "KillerWeb", disabled: true },//la pagina visibile sempre solo il label effetto disabled , perchè non è attvia la promozione / mostra optionID di productId a destr bottone vicino switcher per attivatre a destra si apre pagina checkout
      { to: "/user/dashboard/user", label: "Shuttle", disabled: true },//la pagina visibile sempre solo il label effetto disabled , perchè non è attvia la promozione / mostra optionID di productId a destr bottone vicino switcher per attivatre a destra si apre pagina checkout
    ],
  },
  {
    title: "Configurations",
    items: [
      { to: "/user/dashboard/configuration/id", label: "configurationid.nomeBusiness" },// quando ci clicco va direttamente a configuration/businessForm 
      { to: "/user/dashboard/business", label: "Attività" },
      { to: "/user/dashboard/user", label: "Profilo", disabled: true },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        to: "/user/dashboard/workspace",
        label: "Configurazioni",
      },
    ],
  },
  {
    title: "Orders",
    items: [
      { to: "/user/dashboard/orders", label: "Ordini" },
    ],
  },

  {
    title: "Plans",
    items: [
      { to: "/user/dashboard/plans", label: "Abbonamenti", disabled: true },
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
  return (
    <aside className="dashboard-sidebar">
      {SECTIONS.map((section) => (
        <div key={section.title} className="sidebar-section">
          <h4 className="sidebar-title">{section.title}</h4>

          <ul>
            {section.items.map((item) => (
              <li key={item.to}>
                {item.disabled ? (
                  <span className="sidebar-link disabled">
                    {item.label}
                  </span>
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
    </aside>
  );
}
