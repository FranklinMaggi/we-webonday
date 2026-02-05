import { type ConfigurationUserSummaryDTO } from "@src/user/configurator/base_configuration/configuration/ConfigurationConfiguratorDTO";

export type DashboardVM = {
  configs: ConfigurationUserSummaryDTO[];
  loading: boolean;
  error: string | null;
  onOpenConfig: (id: string) => void;
};