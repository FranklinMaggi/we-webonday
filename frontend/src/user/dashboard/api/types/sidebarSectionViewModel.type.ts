import { type SidebarLinkVM } from "./sidebarLinkViewModel.types";


export type SidebarSectionVM = {
    titleKey: string;
  
    // 🧭 route opzionale del titolo
    titleTo?: string;
  
    items: SidebarLinkVM[];
  };

  
