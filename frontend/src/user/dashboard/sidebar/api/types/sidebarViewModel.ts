export type SidebarVerificationStatus =
  | "DRAFT"
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";

export type SidebarLinkVM = {
  to: string;
  className?: string;
  label?: string;
  labelKey?: string;
  status?: SidebarVerificationStatus;
  disabled?: boolean;
  onClick?: () => void;
};

export type SidebarSectionVM = {
  titleKey: string;
  titleTo?: string;
  items: SidebarLinkVM[];
};
