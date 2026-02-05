// ======================================================
// FE || USER DASHBOARD || CONTAINER
// ======================================================
//
// RUOLO:
// - Fetch configurazioni utente
// - Normalizza stato UI (loading / error / empty)
// - Espone ViewModel alla View
//
// SOURCE OF TRUTH:
// - listMyConfigurations()
//
// ======================================================
import { useNavigate } from "react-router-dom";
import { useMyConfigurations } from "../configurator/base_configuration/configuration/api/configuration.my-configuration-get-list";
import type { ConfigurationUserSummaryDTO } from "@src/user/configurator/base_configuration/configuration/ConfigurationConfiguratorDTO";

export type DashboardVM = {
  configs: ConfigurationUserSummaryDTO[];
  loading: boolean;
  error: string | null;
  onOpenConfig: (id: string) => void;
};

export function useDashboardContainer(): DashboardVM {
  const navigate = useNavigate();
  const { items: configs, loading, error } = useMyConfigurations();

  return {
    configs,
    loading,
    error,
    onOpenConfig: (id) => navigate(`/user/dashboard/configurator/${id}`),
  };
}
