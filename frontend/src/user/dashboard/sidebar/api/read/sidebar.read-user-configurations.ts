import { useMyConfigurations } from
  "@src/user/editor/api/configuration.my-configuration-get-list";
import { getConfigurationDisplayName } from "@src/user/dashboard/api/types/configuration.type.display";

export function useSidebarConfigurations() {
  const { items = [] } = useMyConfigurations();

  return items
  .filter((c) => !c.dataComplete) // ✅ SOLO configurazioni attive
  .map((c) => ({
    to: `/user/dashboard/configurator/${c.id}`, // da correggere , da mettere un link alla configurazione attiva /  
    label: getConfigurationDisplayName(c),
  }));
}
