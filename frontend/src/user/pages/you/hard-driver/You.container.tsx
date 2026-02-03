// ======================================================
// AI-SUPERCOMMENT — YOU CONTAINER
// ======================================================
//
// RUOLO (CHE COSA FA):
// - È il layer di ORCHESTRAZIONE della pagina YOU
// - Punto di aggregazione USER → CONFIGURATION → (BUSINESS opzionale)
// - Trasforma dati grezzi in ViewModel pronti per la View
//
// SOURCE OF TRUTH:
// - CONFIGURATION è la base (useMyConfigurations)
// - BUSINESS è un ARRICCHIMENTO opzionale (best-effort)
//
// COSA FA ESATTAMENTE:
// 1. Carica TUTTE le configuration dell’utente (non terminali)
// 2. Per ciascuna configuration:
//    - prova a caricare il business draft
//    - se ESISTE → arricchisce con preview anagrafica
//    - se NON esiste → restituisce comunque la configuration
// 3. Garantisce che la pagina YOU non sia MAI vuota
//
// COSA **NON** DEVE FARE:
// - NON decide flussi di navigazione
// - NON filtra per stati commerciali
// - NON crea o muta business
// - NON dipende da sidebar o routing
//
// INVARIANTI CRITICI:
// - YOU è CONFIGURATION-CENTRIC
// - L’assenza del business NON è un errore
// - Business.status è derivato, non persistito
// - Qualsiasi failure di fetch business è SILENZIOSA
//
// ⚠️ ATTENZIONE FUTURA:
// - Qualsiasi refactor che renda YOU business-centrico
//   rompe il flusso user → workspace → preview
// ======================================================
import { useEffect, useState } from "react";
import { useMyConfigurations } from
  "../../../configurator/base_configuration/configuration/api/configuration.my-configuration-get-list";
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
            `/api/business/get-base-draft?configurationId=${c.id}`
          );

          // ❗ Se NON esiste business → mostriamo comunque la configuration
          if (!res?.ok || !res.draft) {
            return {
              configurationId: c.id,
              businessName:
                c.prefill?.businessName ?? "Attività",
              status: "DRAFT",
            } as BusinessWithPlanVM;
          }

          const d = res.draft;

          return {
            configurationId: c.id,
            businessName:
              d.businessName ??
              c.prefill?.businessName ??
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
