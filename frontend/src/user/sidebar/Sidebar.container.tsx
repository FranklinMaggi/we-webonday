// ======================================================
// FE || USER DASHBOARD || SIDEBAR CONTAINER
// ======================================================

import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { SidebarView } from "./Sidebar.view";
import { type SidebarSectionVM } from "./Sidebar.types";

import { useMyConfigurations } from "../configurator/base_configuration/configuration/useMyConfigurations";
import { useActiveProductsWithOptions } from "../configurator/base_configuration/configuration/useActiveProducts";

export default function SidebarContainer() {
  
  /* =========================
     ROUTE CONTEXT
  ========================= */
  const { businessId, configurationId } = useParams<{
    businessId?: string;
    configurationId?: string;
  }>();

  /* =========================
     DATA HOOKS
  ========================= */
  const { items: configurations = [] } = useMyConfigurations();
  const { products = [] } = useActiveProductsWithOptions();

  /* =========================
     NORMALIZZAZIONE
  ========================= */
  const businessReady = useMemo(
    () => configurations.filter((c) => c.status === "CONFIGURATION_IN_PROGRESS"),
    [configurations]
  );

  const configurationDrafts = useMemo(
    () => configurations.filter((c) => c.status === "DRAFT"),
    [configurations]
  );

  const businessNameById = useMemo(() => {
    const map = new Map<string, string>();
  
    configurations.forEach((c) => {
      if (c.status === "CONFIGURATION_IN_PROGRESS") {
        map.set(
          c.id,
          c.prefill?.businessName ?? "Attività"
        );
      }
    });
  
    return map;
  }, [configurations]);
  const businessNameByConfigurationId = useMemo(() => {
    const map = new Map<string, string>();
  
    configurations.forEach((c) => {
      map.set(
        c.id,
        c.prefill?.businessName ?? "Attività"
      );
    });
  
    return map;
  }, [configurations]);
  
  /* =========================
     VIEW MODEL
  ========================= */
  const sections: SidebarSectionVM[] = [
    /* ===== YOU ===== */
    {
      titleKey: "sidebar.section.you",
      titleTo: "/user/dashboard/you",
      items: [
        { to: "/user/dashboard/you/profile", labelKey: "sidebar.you.profile" },
        { to: "/user/dashboard/you/account", labelKey: "sidebar.you.account" },
        {
          to: "/user/dashboard/you/settings",
          labelKey: "sidebar.you.settings",
          disabled: true,
        },
      ],
    },

   /* ===== CONFIGURATIONS ===== */
{
  titleKey: "sidebar.section.configurations",
  titleTo: "/user/dashboard/configurator",
  items:
    configurationDrafts.length > 0
      ? configurationDrafts.map((c) => ({
          to: `/user/dashboard/configurator/${c.id}`,
          labelKey:
            businessNameByConfigurationId.get(c.id) ??
            "sidebar.config.default",
        }))
      : [
          {
            to: "/solution",
            labelKey: "sidebar.config.start",
          },
        ],
},


    /* ===== BUSINESS ===== */
    {
      titleKey: "sidebar.section.business",
      titleTo: businessId
        ? `/user/dashboard/business/${businessId}`
        : undefined,

      items: businessId
        ? [
            {
              to: `/user/dashboard/business/${businessId}`,
              labelKey: "sidebar.business.overview",
            },
            {
              to: `/user/dashboard/business/${businessId}/settings`,
              labelKey: "sidebar.business.settings",
            },
          ]
        : businessReady.length > 0
        ? businessReady.map((c) => ({
            to: `/user/dashboard/business/${c.id}`,
            labelKey:  businessNameById.get(c.id) ??
            "sidebar.business.default",
          }))
        : [
            {
              to: "#",
              labelKey: "sidebar.business.empty",
              disabled: true,
            },
          ],
    },

/* ===== WORKSPACE (CONTESTO) ===== */
{
  titleKey: "sidebar.section.workspace",
  items:
    configurationId
      ? [
          {
            to: `/user/dashboard/configurator/${configurationId}`,
            labelKey: "sidebar.workspace.open",
          },
        ]
      : [
          {
            to: "#",
            labelKey: "sidebar.workspace.empty",
            disabled: true,
          },
        ],
},


    /* ===== PLANS ===== */
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

    /* ===== SETTINGS ===== */
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
