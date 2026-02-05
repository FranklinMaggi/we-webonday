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
import type { SidebarSectionVM } from "../../api/types/sidebarSectionViewModel.type";

import { useSidebarBusinesses } from "../api/business/read/sidebar.read-business-complete-list";
import { useSidebarConfigurations } from "../api/configuration/read/sidebar.read-user-configurations";

import { useSidebarOwnerItems } from "../api/owner/read/sidebar.read-owner-complete-list";

export default function SidebarContainer() {
  const businessItems = useSidebarBusinesses();
  const configurationItems = useSidebarConfigurations();
  const ownerItems = useSidebarOwnerItems();
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
        ? businessItems
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
          to: "/solution",
          labelKey: "sidebar.config.start",
        },
      ],
    },
  ];

  return <SidebarView sections={sections} />;
}
