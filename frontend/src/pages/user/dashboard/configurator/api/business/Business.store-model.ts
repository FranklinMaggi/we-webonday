/**
 * ======================================================
 * FE || BusinessStoreModel
 * ======================================================
 *
 * RUOLO:
 * - Stato FE dell’attività business dell’utente
 *
 * USATO DA:
 * - Zustand store
 * - Dashboard user / business
 *
 * ORIGINE:
 * - Backend (via userApi)
 *
 * NOTE:
 * - Rappresenta stato persistente FE
 * - NON è una view
 * ======================================================
 */


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
  
    status: "draft" | "active" | "suspended";
    createdAt: string;
  }
  /* AI-SUPERCOMMENT
 * RUOLO:
 * - Stato Business lato FE
 * - openingHours = verità FE allineata al BE
 */

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
