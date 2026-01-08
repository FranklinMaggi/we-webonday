/**
 * ======================================================
 * FE || CONFIGURATION SETUP STORE
 * ======================================================
 *
 * RUOLO:
 * - Stato FE del wizard di configurazione
 *
 * INVARIANTI:
 * - Stato SOLO frontend
 * - Nessuna fetch
 * - Nessuna persistenza
 * ======================================================
 */

import { create } from "zustand";
import type { UserConfigurationSetupDTO } from "../dto/userConfigurationSetup.dto";

type ConfigurationSetupState = {
  data: Partial<UserConfigurationSetupDTO>;

  setField<K extends keyof UserConfigurationSetupDTO>(
    key: K,
    value: UserConfigurationSetupDTO[K]
  ): void;

  reset(): void;
};

export const useConfigurationSetupStore =
  create<ConfigurationSetupState>((set) => ({
    data: {},

    setField: (key, value) =>
      set((s) => ({
        data: {
          ...s.data,
          [key]: value,
        },
      })),

    reset: () => set({ data: {} }),
  }));
