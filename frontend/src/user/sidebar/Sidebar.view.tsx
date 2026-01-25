// ======================================================
// FE || USER DASHBOARD || SIDEBAR VIEW
// ======================================================
//
// RUOLO:
// - Rendering puro Sidebar
// - Nessuna logica business
//
// INVARIANTI:
// - Usa solo ViewModel (VM)
// - Usa solo classi centralizzate
// - Testo risolto tramite i18n centrale (aiTranslateGenerator)
// ======================================================

import { NavLink } from "react-router-dom";
import { type SidebarSectionVM } from "./Sidebar.types";
import { sidebarClasses } from "./sidebar.classes";
import { t } from "@shared/aiTranslateGenerator";

export function SidebarView({
  sections,
}: {
  sections: SidebarSectionVM[];
}) {
  return (
    <aside className={sidebarClasses.root}>
      {sections.map((section) => (
        <div
          key={section.titleKey}
          className={sidebarClasses.section}
        >
<h4 className={sidebarClasses.title}>
  {section.titleTo ? (
    <NavLink
      to={section.titleTo}
      className={sidebarClasses.titleLink}
    >
      {t(section.titleKey)}
    </NavLink>
  ) : (
    t(section.titleKey)
  )}
</h4>


          <ul className={sidebarClasses.list}>
            {section.items.map((item) => (
              <li
                key={item.to + item.labelKey}
                className={sidebarClasses.item}
              >
                {item.disabled ? (
                  <span
                    className={`${sidebarClasses.link} ${sidebarClasses.linkDisabled}`}
                  >
                    {t(item.labelKey)}
                  </span>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${sidebarClasses.link} ${
                        isActive ? sidebarClasses.linkActive : ""
                      }`
                    }
                  >
                    {t(item.labelKey)}
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
