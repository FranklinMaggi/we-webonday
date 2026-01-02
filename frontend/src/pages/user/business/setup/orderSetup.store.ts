// ======================================================
// FE || pages/user/business/setup/orderSetup.store.ts
// ======================================================
// ORDER SETUP STORE — STATO TEMPORANEO FE
//
// RUOLO:
// - Mantenere i dati del wizard ordine
//
// RESPONSABILITÀ:
// - Stato locale FE
// - Mutazioni campo per campo
//
// NON FA:
// - NON persiste su backend
// - NON valida schema
//
// NOTE:
// - Store effimero
// - Reset obbligatorio post-submit
// ======================================================
import { create } from "zustand";


export type OrderSetupData = {
  businessName: string;
  sector: string;
  city: string;
  email: string;
  phone?: string;

  primaryColor: string;
  style: "modern" | "elegant" | "minimal" | "bold";
  referenceUrl?: string;

  description: string;
  services: string;
  cta: string;

  extras: {
    maps: boolean;
    whatsapp: boolean;
    newsletter: boolean;
  };
};

export const useOrderSetupStore = create<{
  data: Partial<OrderSetupData>;
  setField: (key: keyof OrderSetupData, value: any) => void;
  reset: () => void;
}>((set) => ({
  data: {},
  setField: (key, value) =>
    set((s) => ({ data: { ...s.data, [key]: value } })),
  reset: () => set({ data: {} }),
}));
