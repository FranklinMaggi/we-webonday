// ======================================================
// FE || USER DASHBOARD || YOU — CONTAINER
// ======================================================
//
// RUOLO:
// - Aggrega lo stato dell’utente nel sistema
// - Configurazioni (DRAFT / READY)
// - Business attivi
// - Piani attivi (products + options)
//
// NON FA:
// - Modifiche dati
// - Navigazione diretta (delegata alla view)
//
// ======================================================

import { useMyConfigurations } from "../dashboard/configurator/api/useMyConfigurations";
import { useMyBusinesses } from "../dashboard/configurator/api/useMyBusinessDrafts";
import { useActiveProductsWithOptions } from "../dashboard/configurator/api/useActiveProducts";

export type YouDashboardVM = {
  configurations: any[];
  businesses: any[];
  products: any[];
  hasBusiness: boolean;
};

export function useYouDashboardContainer(): YouDashboardVM {
  const { items: configurations = [] } = useMyConfigurations();
  const { completed: businesses = [] } = useMyBusinesses();
  const { products = [] } = useActiveProductsWithOptions();

  return {
    configurations,
    businesses,
    products,
    hasBusiness: businesses.length > 0,
  };
}
