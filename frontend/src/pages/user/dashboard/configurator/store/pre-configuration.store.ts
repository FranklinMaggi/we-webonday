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


//
// ======================================================

import { create } from "zustand";

interface PreConfigurationState {
  businessName: string | null;
  setBusinessName: (name: string) => void;
  consumeBusinessName: () => string | null;
}

import { persist } from "zustand/middleware";

export const usePreConfigurationStore = create<PreConfigurationState>()(
    persist(
      (set, get) => ({
        businessName: null,
        setBusinessName: (name) => set({ businessName: name.trim() ||null }),
        consumeBusinessName: () => {
          const name = get().businessName;
          set({ businessName: null });
          return name;
        },
      }),
      { name: "wod-pre-config" }
    )
  );
  

