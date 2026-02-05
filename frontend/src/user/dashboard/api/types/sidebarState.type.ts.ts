// ======================================================
// FE || USER DASHBOARD || SIDEBAR TYPES
// ======================================================
//
// RUOLO:
// - ViewModel puro
// - Nessun testo hardcoded
// - i18n-ready
// ======================================================
export type SidebarState = {
  hasUser: boolean;

  configurations: {
    total: number;
    drafts: number;
    active: number;
  };

  business: {
    businessDraftComplete: boolean;
    verification?: "PENDING" | "ACCEPTED" | "REJECTED";
  };

  owner: {
    hasDraft: boolean;
    ownerDraftCopmlete: boolean;
    verification?: "PENDING" | "ACCEPTED" | "REJECTED";
  };
};