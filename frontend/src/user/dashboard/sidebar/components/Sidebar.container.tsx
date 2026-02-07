// ======================================================
// FE || USER DASHBOARD || SIDEBAR CONTAINER (SALDATO)
// ======================================================
//
// RUOLO:
// - orchestra la sidebar
// - NON conosce i domini
// - NON filtra
// - NON mappa
//
// ======================================================

import { SidebarView } from "./Sidebar.view";
import type { SidebarSectionVM } from "../api/types/sidebarViewModel";

import { useSidebarBusinesses } from "../api/business/read/useSidebarBusiness";
import { useSidebarConfigurations } from "../api/read/sidebar.read-user-configurations";
import { useConfigurationSetupStore } from
  "@src/user/editor/api/type/configurator/configurationSetup.store";
import { useNavigate } from "react-router-dom";
import { useSidebarOwner } from "../api/owner/read/useSideBarOwner";

export default function SidebarContainer() {
  //RECUPERA I LINK BUSINESS + FORMA DATI GIAÄ PRONTI PER LA VIEW
  const businessItems = useSidebarBusinesses();
//RECUPERA I LINK CONFIGURAZIONI 
  const configurationItems = useSidebarConfigurations();
  //RECUPERA I LINK PROPRIETARIO + FORMA DATI GIAÄ PRONTI PER LA VIEW 
  const ownerItems = useSidebarOwner();
  /** */
  const navigate = useNavigate();
  /** */
const { reset } = useConfigurationSetupStore();
/** definisce la sidebar finale , la view riceve questo */
  const sections: SidebarSectionVM[] = [
    {
      titleKey: "sidebar.section.you",
      titleTo: "/user/dashboard/you",
      items: [
        ...ownerItems,
        {
          to: "/user/dashboard/you/account",
          labelKey: "sidebar.you.account",
        },
      ],
    },

    {
      titleKey: "sidebar.section.business",
      items: businessItems.length
        ? businessItems.map(item => ({
            ...item,
            status: item.status as "PENDING" | "ACCEPTED" | "REJECTED" | undefined,
          }))
        : [
            {
              to: "#",
              labelKey: "sidebar.business.empty",
             disabled: true,
            },
          ],
    },

    {
      titleKey: "sidebar.section.configurations",
      items: [
        ...configurationItems,
        {
          to: "#",
          labelKey: "sidebar.config.start",
          onClick: () => {
            reset();
            navigate("/solution");
          },
        }
      ],
    },
  ];

  return <SidebarView sections={sections} />;
}
