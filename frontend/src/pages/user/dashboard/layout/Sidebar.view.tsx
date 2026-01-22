// ======================================================
// FE || SIDEBAR || VIEW
// ======================================================
//
// RUOLO:
// - Rendering puro
// - Nessuna logica business
// - Nessun hook
// - Nessun if complesso
// ======================================================

import { NavLink } from "react-router-dom";
import { type SidebarSectionVM } from "./Sidebar.types";

export function SidebarView({
  sections,
}: {
  sections: SidebarSectionVM[];
}) {
  return (
    <aside className="dashboard-sidebar">
      {sections.map((section) => (
        <div
          key={section.title}
          className="sidebar-section"
        >
          <h4 className="sidebar-title">
            {section.title}
          </h4>

          <ul>
            {section.items.map((item) => (
              <li key={item.label + item.to}>
                {item.disabled ? (
                  <span className="sidebar-link disabled">
                    {item.label}
                  </span>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `sidebar-link ${
                        isActive ? "active" : ""
                      }`
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
