// ======================================================
// FE || USER DASHBOARD || YOU — CONTAINER
// ======================================================
//
// RUOLO:
// - Aggrega lo stato dell’utente nel sistema
// - Configurazioni (DRAFT / READY)
// - Business attivi
// - Piano attivo per business (product + options)
//
// NON FA:
// - Modifiche dati
// - Navigazione diretta (delegata alla view)
//
// ======================================================

import { useMyConfigurations } from "../../../configurator/base_configuration/configuration/useMyConfigurations";
import { useMyBusinesses } from "../../../components/hooks/useMyBusinessDrafts";

import type {
  ProductOptionVM,
} from "@shared/lib/viewModels/product/Product.view-model";

/* ======================================================
   VIEW MODELS
====================================================== */

export type BusinessWithPlanVM = {
  configurationId: string;
  businessName: string;
  status: "ACTIVE" | string;

  activePlan?: {
    productId: string;
    name: string;
    options?: ProductOptionVM[];
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
  const { items: configurations = [] } = useMyConfigurations();
  const { completed: businessesRaw = [] } = useMyBusinesses();

  const businesses: BusinessWithPlanVM[] = businessesRaw.map(
    (b: any): BusinessWithPlanVM => ({
      configurationId: b.configurationId,
      businessName: b.businessName,
      status: b.status ?? "ACTIVE",

      activePlan: b.activePlan
        ? {
            productId: b.activePlan.productId,
            name: b.activePlan.name,

            options: b.activePlan.options?.map((o: any) => ({
              id: o.id,
              label: o.label ?? o.name,
              price: Number(o.price) || 0,
              description: o.description,
              type: o.type ?? "monthly",
            })),
          }
        : undefined,
    })
  );

  return {
    configurations,
    businesses,
  };
}
