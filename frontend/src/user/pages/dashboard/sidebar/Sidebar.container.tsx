// ======================================================
// FE || USER DASHBOARD || SIDEBAR CONTAINER
// ======================================================
//
// RUOLO:
// - Orchestrazione dati Sidebar
// - Mapping hook → ViewModel
// - ZERO JSX strutturale
//
// NOTE:
// - Nessuna stringa UI
// - i18n tramite key
// - Pronto per Context Wrapper futuro
//
// FALLBACK SAFE:
// - Se un hook fallisce → array vuoti
// ======================================================

import { SidebarView } from "./Sidebar.view";
import { type SidebarSectionVM } from "./Sidebar.types";

import { useMyConfigurations } from "../configurator/api/useMyConfigurations";
import { useActiveProductsWithOptions } from "../configurator/api/useActiveProducts";

export default function SidebarContainer() {
  const { items: configurations = [] } = useMyConfigurations();
  const { products = [] } = useActiveProductsWithOptions();

  /* =========================
     NORMALIZZAZIONE DATI
  ========================= */

  const businessReady = configurations.filter(
    (c) => c.status === "READY"
  );

  const configurationDrafts = configurations.filter(
    (c) => c.status === "DRAFT"
  );

  /* =========================
     VIEW MODEL
  ========================= */

  const sections: SidebarSectionVM[] = [
    {
      titleKey: "sidebar.section.you",
      titleTo: "/user/dashboard/you",
      items: [
        {
          to: "/user/dashboard",
          labelKey: "sidebar.you.profile",
        },
        {
          to: "/user/dashboard/business",
          labelKey: "sidebar.you.account",
        },
        {
          to: "/user/dashboard/user",
          labelKey: "sidebar.you.settings",
          disabled: true,
        },
      ],
    },
    

    {
      titleKey: "sidebar.section.configurations",
      items:
        configurationDrafts.length > 0
          ? configurationDrafts.map((c) => ({
              to: `/user/dashboard/workspace/${c.id}`,
              labelKey: "sidebar.config.default",
            }))
          : [
              {
                to: "/solution",
                labelKey: "sidebar.config.start",
              },
            ],
    },

    {
      titleKey: "sidebar.section.business",
      items:
        businessReady.length > 0
          ? businessReady.map((c) => ({
              to: `/user/dashboard/business/${c.id}`,
              labelKey: "sidebar.business.default",
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
      titleKey: "sidebar.section.plans",
      items:
        products.length > 0
          ? products.map(() => ({
              to: "#",
              labelKey: "sidebar.plans.empty",
              disabled: true,
            }))
          : [
              {
                to: "#",
                labelKey: "sidebar.plans.empty",
                disabled: true,
              },
            ],
    },

    {
      titleKey: "sidebar.section.workspace",
      items: [
        {
          to: "/user/dashboard/workspace/:id",
          labelKey: "sidebar.workspace.setup",
        },
        {
          to: "/user/dashboard/workspace/weby",
          labelKey: "sidebar.workspace.engine",
        },
        {
          to: "/user/dashboard/workspace/web-ai",
          labelKey: "sidebar.workspace.ai",
        },
      ],
    },

    {
      titleKey: "sidebar.section.settings",
      items: [
        {
          to: "/user/dashboard/settings",
          labelKey: "sidebar.settings.disabled",
          disabled: true,
        },
      ],
    },
  ];

  return <SidebarView sections={sections} />;
}
