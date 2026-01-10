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
  