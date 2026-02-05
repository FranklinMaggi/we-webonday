import { useMyConfigurations } from
"@src/user/configurator/base_configuration/configuration/api/configuration.my-configuration-get-list";
import type { SidebarBusinessStatus } from
"@src/user/dashboard/api/types/sidebarLinkViewModel.types";

/**
 * OWNER SIDEBAR ITEM
 *
 * REGOLA:
 * - Owner è UNICO per utente
 * - Anche se esistono più configuration
 * - Lo stato è DERIVATO (best effort) dalle configuration
 */
export function useSidebarOwnerItems() {
    const { items = [] } = useMyConfigurations();
  
    if (items.length === 0) return [];
  
    // 🔑 Stato owner = stato "più avanzato" tra le configuration
    const status: SidebarBusinessStatus =
      items.some((c) => c.status === "ACCEPTED")
        ? "ACCEPTED"
        : items.some((c) => c.status === "REJECTED")
        ? "REJECTED"
        : "PENDING";
  
    return [
      {
        to: "/user/dashboard/you/profile",
        labelKey: "sidebar.profile.owner",
        status,
      },
    ];
  }
  