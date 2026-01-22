// ======================================================
// FE || SIDEBAR || CONTAINER
// ======================================================
//
// RUOLO:
// - Orchestrazione dati Sidebar
// - Fetch + mapping
// - ZERO JSX strutturale
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
  const businessReady = configurations.filter(
    (c) => c.status === "READY"
  );
  
  const configrationSpace = configurations.filter(
    (c) => c.status === "DRAFT"
  );
  

  const sections: SidebarSectionVM[] = [
    {
      title: "You On ",
      items: [
        { to: "/user/dashboard", label: "Profilo" },
        { to: "/user/dashboard/business", label: "Account" },
        { to: "/user/dashboard/user", label: "Settings" ,disabled:true },
      ],
    },

    {
      title: "Configurations",
      items:
      configrationSpace.length > 0
        ? configrationSpace.map((c) => ({
            to: `/user/dashboard/workspace/${c.id}`,
            label: c.prefill?.businessName ?? "Configurazione",
          }))
        : [
            {
              to: "/solution",
              label: "Inizia una configurazione →",
            },
          ],
    },

    {
      title: "Business",
      items:
        businessReady.length > 0
          ? businessReady.map((c) => ({
              to: `/user/dashboard/business/${c.id}`,
              label: c.prefill?.businessName ?? "Attività",
            }))
          : [
              {
                to: "#",
                label: "Nessun business attivo",
                disabled: true,
              },
            ],
    },

    {
      title: "Plans",
      items:
        products.length > 0
          ? products.map((p) => ({
              to: "#",
              label: p.name,
              disabled: true,
            }))
          : [
              {
                to: "#",
                label: "Nessun piano disponibile",
                disabled: true,
              },
            ],
    },

    {
      title: "Workspace",
      items: [
        {
          to: "/user/dashboard/workspace/:id",
          label: "Set Up",
        },
        {
          to: "/user/dashboard/workspace/weby",
          label: "Weby Engine Dev",
        },
        {
          to: "/user/dashboard/workspace/web-ai",
          label: "Weby + AI",
        },
      ],
    },

    {
      title: "Settings",
      items: [
        {
          to: "/user/dashboard/settings",
          label: "Impostazioni",
          disabled: true,
        },
      ],
    },
  ];

  return <SidebarView sections={sections} />;
}
