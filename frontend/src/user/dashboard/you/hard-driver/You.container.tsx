// ======================================================
// FE || USER DASHBOARD || YOU CONTAINER
// ======================================================
//
// COSA FA:
// - raccoglie tutte le configurazioni dell’utente
// - prova ad aggiungere un’anteprima business
//
// PERCHÉ ESISTE:
// - la pagina YOU deve funzionare anche se manca il business
//
// COSA NON FA:
// - non decide flussi
// - non crea dati
// ======================================================
import { useEffect, useState } from "react";
import { useMyConfigurations } from
  "../../../editor/api/configuration.my-configuration-get-list";
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
/* =========================
   LOAD BUSINESS PREVIEW (OPTIONAL)
   PERCHÉ:
   - YOU è configuration-centric
   - Business è un arricchimento
========================= */
useEffect(() => {
  let cancelled = false;

  async function loadBusinesses() {
    // 🔑 TUTTE le configuration non terminali
    const activeConfigs = configurations.filter(
      (c) =>
        c.status !== "CANCELLED" &&
        c.status !== "ARCHIVED"
    );

    const results = await Promise.all(
      activeConfigs.map(async (c) => {
        try {
          const res = await apiFetch<{
            ok: boolean;
            draft?: any;
          }>(
            `/api/business/get?configurationId=${c.id}`
          );

          // ❗ Se NON esiste business → mostriamo comunque la configuration
          if (!res?.ok || !res.draft) {
            return {
              configurationId: c.id,
              businessName:
                c.display?.businessName ?? "Attività",
              status: "DRAFT",
            } as BusinessWithPlanVM;
          }

          const d = res.draft;

          return {
            configurationId: c.id,
            businessName:
              d.businessName ??
              c.display?.businessName ??
              "Attività",
            status: d.complete ? "ACTIVE" : "DRAFT",
            preview: {
              address: d.contact?.address,
              phoneNumber: d.contact?.phoneNumber,
              mail: d.contact?.mail,
              openingHours: d.openingHours,
            },
          } as BusinessWithPlanVM;
        } catch {
          return null;
        }
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
