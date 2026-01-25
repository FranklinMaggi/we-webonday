// ======================================================
// FE || USER DASHBOARD || YOU — CONTAINER
// ======================================================

import { useEffect, useState } from "react";
import { useMyConfigurations } from
  "../../../configurator/base_configuration/configuration/useMyConfigurations";
import { apiFetch } from "@shared/lib/api";

/* ======================================================
   VIEW MODELS
====================================================== */

export interface ProductOptionVM {
  id: string;
  label: string;
  price: number;
  description: string;
}

export type BusinessWithPlanVM = {
  configurationId: string;
  businessName: string;
  status: "ACTIVE" | "DRAFT";

  preview?: {
    address?: {
      street?: string;
      city?: string;
      province?: string;
      zip?: string;
    };
    phoneNumber?: string;
    mail?: string;
    openingHours?: Record<
      string,
      { from: string; to: string }[]
    >;
  };
};

export type YouDashboardVM = {
  configurations: any[];
  businesses: BusinessWithPlanVM[];
};

/* ======================================================
   CONTAINER
====================================================== */

export function useYouDashboardContainer(): YouDashboardVM {
  /* ❗ HOOKS SEMPRE IN ALTO, SEMPRE LINEARI */
  const { items: configurations = [] } = useMyConfigurations();

  const [businesses, setBusinesses] =
    useState<BusinessWithPlanVM[]>([]);

  /* =========================
     LOAD BUSINESS PREVIEW
  ========================= */
  useEffect(() => {
    let cancelled = false;

    async function loadBusinesses() {
      const activeConfigs = configurations.filter(
        (c) => c.status === "CONFIGURATION_IN_PROGRESS"
      );

      const results = await Promise.all(
        activeConfigs.map(async (c) => {
          const res = await apiFetch<{
            ok: boolean;
            draft?: any;
          }>(
            `/api/business/get-base-draft?configurationId=${c.id}`
          );

          if (!res?.ok || !res.draft) return null;

          const d = res.draft;

          return {
            configurationId: c.id,
            businessName: d.businessName ?? "Attività",
            status: d.complete ? "ACTIVE" : "DRAFT",
            preview: {
              address: d.contact?.address,
              phoneNumber: d.contact?.phoneNumber,
              mail: d.contact?.mail,
              openingHours: d.openingHours,
            },
          } as BusinessWithPlanVM;
        })
      );

      if (!cancelled) {
        setBusinesses(
          results.filter(Boolean) as BusinessWithPlanVM[]
        );
      }
    }

    loadBusinesses();

    return () => {
      cancelled = true;
    };
  }, [configurations]);

  return {
    configurations,
    businesses,
  };
}
