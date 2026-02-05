import { useMyConfigurations } from
  "@src/user/configurator/base_configuration/configuration/api/configuration.my-configuration-get-list";
import { getConfigurationDisplayName } from "@src/user/dashboard/api/types/configuration.type.display";

export function useSidebarConfigurations() {
  const { items = [] } = useMyConfigurations();

  return items
    .filter((c) => c.status !== "BUSINESS_READY")
    .map((c) => ({
      to: `/user/dashboard/configurator/${c.id}`,
      label: getConfigurationDisplayName(c),
    }));
}
