
export interface BusinessDTO {
    id: string;
    ownerUserId: string;
  
    name: string;
    address: string;
    phone: string;
    openingHours?: string | null;
  
    menuPdfUrl: string | null;
  
    referralToken: string;
    referredBy: string | null;
  
    verification: "PENDING" | "ACCEPTED" | "REJECTED";
    createdAt: string;
  }

  
export type TimeRange = { from: string; to: string };

export type OpeningHours = {
  monday: TimeRange[];
  tuesday: TimeRange[];
  wednesday: TimeRange[];
  thursday: TimeRange[];
  friday: TimeRange[];
  saturday: TimeRange[];
  sunday: TimeRange[];
};

export type BusinessState = {
  openingHours: OpeningHours;
  loading: boolean;
  error?: string;
};

export const emptyOpeningHours: OpeningHours = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};
