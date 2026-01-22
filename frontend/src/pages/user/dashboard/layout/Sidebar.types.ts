// ======================================================
// FE || SIDEBAR || TYPES
// ======================================================

export type SidebarLink = {
    to: string;
    label: string;
    disabled?: boolean;
  };
  
  export type SidebarSectionVM = {
    title: string;
    items: SidebarLink[];
  };
  