// ======================================================
// FE || USER DASHBOARD || SIDEBAR CONTAINER (OPTIMIZED)
// ======================================================
//
// INVARIANTI:
// - Sidebar configuration-centric
// - Workspace = Configuration
// - Preview vive nel Workspace
// - Business è derivato (non prerequisito)
// - Sidebar NON fa fetch per-item
// ======================================================

import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { SidebarView } from "./Sidebar.view";
import type { SidebarSectionVM } from "./Sidebar.types";

import { useMyConfigurations } from
  "../configurator/base_configuration/configuration/api/configuration.my-configuration-get-list";
import { useMyBusinesses } from "../configurator/business/api/useMyBusinessDrafts";
import { useActiveProductsWithOptions } from
  "../configurator/base_configuration/configuration/api/useActiveProducts";

export default function SidebarContainer() {
  /* =========================
     ROUTE CONTEXT
  ========================= */
  const { businessId } = useParams<{ businessId?: string }>();

  /* =========================
     DATA HOOKS (AGGREGATED)
  ========================= */
  const { items: configurations = [] } = useMyConfigurations();
  const { completed, inProgress } = useMyBusinesses();
  const { products = [] } = useActiveProductsWithOptions();

  /* =========================
     CONFIGURATION VISIBILITY
     - Escludiamo solo stati terminali
  ========================= */
  const workspaceConfigurations = useMemo(
    () =>
      configurations.filter(
        (c) =>
          c.status !== "CANCELLED" &&
          c.status !== "ARCHIVED"
      ),
    [configurations]
  );

  const configurationDrafts = useMemo(
    () => configurations.filter((c) => c.status === "DRAFT"),
    [configurations]
  );

  /* =========================
     NAME MAP (Configuration)
  ========================= */
  const configurationNameById = useMemo(() => {
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
     BUSINESS LOOKUP (O(1))
     - Risolto UNA VOLTA
  ========================= */
  const businessByConfigId = useMemo(() => {
    const map = new Map<
      string,
      { businessName: string; complete: boolean }
    >();

    [...completed, ...inProgress].forEach((b) => {
      map.set(b.configurationId, b);
    });

    return map;
  }, [completed, inProgress]);

  /* =========================
     VERIFICATION TARGET
  ========================= */
  const firstWorkspaceId = workspaceConfigurations[0]?.id;

  const verificationTargetId =
    businessId ?? firstWorkspaceId;

  const verificationTo = verificationTargetId
    ? `/user/dashboard/business/${verificationTargetId}`
    : "/user/dashboard/configurator";

  /* =========================
     VIEW MODEL (SIDEBAR)
  ========================= */
  const sections: SidebarSectionVM[] = [
    /* ===== YOU ===== */
    {
      titleKey: "sidebar.section.you",
      titleTo: "/user/dashboard/you",
      items: [
        {
          to: "/user/dashboard/you/profile",
          labelKey: "sidebar.you.profile",
        },
        {
          to: "/user/dashboard/you/account",
          labelKey: "sidebar.you.account",
        },
        {
          to: verificationTo,
          labelKey: "sidebar.you.verification",
        },
      ],
    },

    /* ===== BUSINESS ===== */
    {
      titleKey: "sidebar.section.business",
      items:
        completed.length > 0
          ? completed.map((b) => ({
              to: `/user/dashboard/business/${b.configurationId}`,
              labelKey: b.businessName,
            }))
          : [
              {
                to: "#",
                labelKey: "sidebar.business.empty",
                disabled: true,
              },
            ],
    },

    /* ===== WORKSPACE ===== */
    {
      titleKey: "sidebar.section.workspace",
      items:
        workspaceConfigurations.length > 0
          ? workspaceConfigurations.map((c) => ({
              to: `/user/dashboard/workspace/${c.id}`,
              labelKey:
                configurationNameById.get(c.id) ??
                "sidebar.workspace.site",
            }))
          : [
              {
                to: "#",
                labelKey: "sidebar.workspace.empty",
                disabled: true,
              },
            ],
    },

    /* ===== PREVIEW ===== */
    {
      titleKey: "sidebar.section.preview",
      items:
        workspaceConfigurations.length > 0
          ? workspaceConfigurations.map((c) => ({
              to: `/user/dashboard/workspace/${c.id}/preview`,
              labelKey:
                configurationNameById.get(c.id) ??
                "sidebar.preview.site",
            }))
          : [
              {
                to: "#",
                labelKey: "sidebar.preview.empty",
                disabled: true,
              },
            ],
    },

    /* ===== CONFIGURATIONS (DRAFTS) ===== */
    {
      titleKey: "sidebar.section.configurations",
      titleTo: "/user/dashboard/configurator",
      items:
        configurationDrafts.length > 0
          ? configurationDrafts.map((c) => ({
              to: `/user/dashboard/configurator/${c.id}`,
              labelKey:
                configurationNameById.get(c.id) ??
                "sidebar.config.default",
            }))
          : [
              {
                to: "/solution",
                labelKey: "sidebar.config.start",
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