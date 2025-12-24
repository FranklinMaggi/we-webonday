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
