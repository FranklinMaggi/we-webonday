// ======================================================
// FE || USER DASHBOARD || SIDEBAR TYPES
// ======================================================
//
// RUOLO:
// - ViewModel puro
// - Nessun testo hardcoded
// - i18n-ready
// ======================================================

export type SidebarLinkVM = {
  to: string;
  labelKey: string;
  disabled?: boolean;
};

export type SidebarSectionVM = {
  titleKey: string;

  // 🧭 route opzionale del titolo
  titleTo?: string;

  items: SidebarLinkVM[];
};
