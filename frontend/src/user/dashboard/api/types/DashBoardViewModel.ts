import { type ConfigurationUserSummaryDTO } from "@src/user/editor/api/DataTransferObject/ConfigurationConfiguratorDTO";

export type DashboardVM = {
  configs: ConfigurationUserSummaryDTO[];
  loading: boolean;
  error: string | null;
  onOpenConfig: (id: string) => void;
};