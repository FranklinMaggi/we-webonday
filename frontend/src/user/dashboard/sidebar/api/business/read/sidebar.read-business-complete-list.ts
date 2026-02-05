import { useMyConfigurations } from
  "@src/user/configurator/base_configuration/configuration/api/configuration.my-configuration-get-list";
import { getConfigurationDisplayName } from "@src/user/dashboard/api/types/configuration.type.display";
import type { SidebarBusinessStatus } from "@src/user/dashboard/api/types/sidebarLinkViewModel.types";

export function useSidebarBusinesses() {
  const { items = [] } = useMyConfigurations();

  return items
    .filter((c) => c.status === "BUSINESS_READY")
    .map((c) => {
      const status: SidebarBusinessStatus =
        c.status === "ACCEPTED"
          ? "ACCEPTED"
          : c.status === "REJECTED"
          ? "REJECTED"
          : "PENDING";

      return {
        to: `/user/dashboard/business/${c.id}`,
        label: getConfigurationDisplayName(c),
        status,
      };
    });
}
