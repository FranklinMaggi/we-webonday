// ======================================================
// FE || STORE — PreConfiguration (PreLogin Safe)
// ======================================================
//
// RUOLO:
// - Conservare dati minimi raccolti pre-login
// - Trasporto sicuro verso PostLogin
//
// INVARIANTI:
// - FE only
// - Nessuna persistenza
// - Viene consumato UNA SOLA VOLTA
//
// ======================================================

import { create } from "zustand";

interface PreConfigurationState {
  businessName: string | null;
  setBusinessName: (name: string) => void;
  consumeBusinessName: () => string | null;
}

export const usePreConfigurationStore =
  create<PreConfigurationState>((set, get) => ({
    businessName: null,

    setBusinessName: (name) =>
      set({ businessName: name }),

    consumeBusinessName: () => {
      const value = get().businessName;
      set({ businessName: null }); // 🔥 one-shot
      return value;
    },
  }));
