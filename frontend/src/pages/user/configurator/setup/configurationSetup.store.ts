// ======================================================
// FE || pages/user/configurator/setup/configurationSetup.store.ts
// ======================================================
//
// CONFIGURATION SETUP STORE — DRAFT FE
//
// RUOLO:
// - Stato configurazione progetto
//
// INVARIANTI:
// - Stato PRE-ORDER
// - Persistenza futura lato BE
//
// ======================================================

import { create } from "zustand";

export type ConfigurationSetupData = {
  businessName: string;
  sector: string;
  city: string;
  email: string;
  phone?: string;

  primaryColor: string;
  style: "modern" | "elegant" | "minimal" | "bold";

  description: string;
  services: string;
  cta: string;

  extras: {
    maps: boolean;
    whatsapp: boolean;
    newsletter: boolean;
  };
};

export const useConfigurationSetupStore = create<{
  data: Partial<ConfigurationSetupData>;
  setField: (
    key: keyof ConfigurationSetupData,
    value: any
  ) => void;
  reset: () => void;
}>((set) => ({
  data: {},
  setField: (key, value) =>
    set((s) => ({ data: { ...s.data, [key]: value } })),
  reset: () => set({ data: {} }),
}));
