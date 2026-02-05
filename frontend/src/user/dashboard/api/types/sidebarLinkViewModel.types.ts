export type SidebarLinkVM = {
  to: string;

  /** testo dinamico (nome business) */
  label?: string;

  /** i18n key (solo per UI statica / CTA) */
  labelKey?: string;

  /** stato visivo business */
  status?: "PENDING" | "ACCEPTED" | "REJECTED";

  disabled?: boolean;
};

export type SidebarBusinessStatus =
  |"DRAFT"
  | "ACCEPTED"
  | "REJECTED"
  | "PENDING";