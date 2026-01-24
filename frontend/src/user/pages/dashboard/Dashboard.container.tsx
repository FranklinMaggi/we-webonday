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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyConfigurations } from "./configurator/api/configuration.user.api";
import type { ConfigurationConfiguratorDTO } from "./configurator/models/ConfigurationConfiguratorDTO";

export type DashboardVM = {
  configs: ConfigurationConfiguratorDTO[];
  loading: boolean;
  error: string | null;
  onOpenConfig: (id: string) => void;
};

export function useDashboardContainer(): DashboardVM {
  const navigate = useNavigate();

  const [configs, setConfigs] = useState<ConfigurationConfiguratorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listMyConfigurations()
      .then((res) => {
        if (!res.ok) throw new Error("LOAD_FAILED");
        setConfigs(res.items ?? []);
      })
      .catch(() => {
        setError("dashboard.error.load");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    configs,
    loading,
    error,
    onOpenConfig: (id) =>
      navigate(`/user/dashboard/workspace/${id}`),
  };
}
