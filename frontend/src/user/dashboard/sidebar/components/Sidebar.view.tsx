// ======================================================
// FE || USER DASHBOARD || SIDEBAR VIEW
// ======================================================
//
// COSA FA:
// - disegna la sidebar
//
// PERCHÉ ESISTE:
// - mostra i link già decisi dal container
//
// COSA NON FA:
// - non prende decisioni
// - non conosce il dominio
// ======================================================
import { NavLink } from "react-router-dom";
import { type SidebarSectionVM } from "../../api/types/sidebarSectionViewModel.type";
import { sidebarClasses } from "./sidebar.classes";
import { t } from "@shared/aiTranslateGenerator";


    function getStatusClass(
      status?: "PENDING" | "ACCEPTED" | "REJECTED"
    ) {
      if (status === "ACCEPTED") return "status-green";
      if (status === "PENDING" || status === "REJECTED")
        return "status-orange";
      return "";
    }


export function SidebarView({ sections } : 
  { sections: SidebarSectionVM[];}) { 
  
  return (
        <aside className={sidebarClasses.root}>
          {sections.map((section) => (
          <div 
          key={section.titleKey} 
          className={sidebarClasses.section} >
            
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
              <li key={item.to + item.labelKey}
                className={sidebarClasses.item}>
                {item.disabled ? (
                        <span
                          className={`${sidebarClasses.link} 
                          ${sidebarClasses.linkDisabled}`}>
                          {item.label ?? t(item.labelKey!)}
                        </span>        
                  )   :   (
                        <NavLink to={item.to}
                        className={({ isActive }) =>
                        `${sidebarClasses.link}
                        ${isActive ? sidebarClasses.linkActive : ""}
                        ${getStatusClass(item.status)}`}>
                        {item.label ?? t(item.labelKey!)}
                        </NavLink> )}
              </li>))}
            </ul>
          </div>))}
        </aside>
);}
