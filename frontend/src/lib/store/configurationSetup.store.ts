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
 *
 * NOTE:
 * - businessId e configurationId sono STATO TECNICO
 * - NON fanno parte del DTO
 * ======================================================
 */

import { create } from "zustand";
import type { UserConfigurationSetupDTO } from "../storeModels/ConfigurationSetup.store-model";

type ConfigurationSetupState = {
  // =========================
  // DATI WIZARD (DTO FE)
  // =========================
  data: Partial<UserConfigurationSetupDTO>;

  // =========================
  // STATO TECNICO
  // =========================
  businessId?: string;
  configurationId?: string;

  // =========================
  // MUTATORS
  // =========================
  setField<K extends keyof UserConfigurationSetupDTO>(
    key: K,
    value: UserConfigurationSetupDTO[K]
  ): void;

  setBusinessId(id: string): void;
  setConfigurationId(id: string): void;

  reset(): void;
};

export const useConfigurationSetupStore =
  create<ConfigurationSetupState>((set) => ({
    // =========================
    // STATE
    // =========================
    data: {},
    businessId: undefined,
    configurationId: undefined,

    // =========================
    // MUTATORS
    // =========================
    setField: (key, value) =>
      set((state) => ({
        data: {
          ...state.data,
          [key]: value,
        },
      })),

    setBusinessId: (id) =>
      set(() => ({ businessId: id })),

    setConfigurationId: (id) =>
      set(() => ({ configurationId: id })),

    reset: () =>
      set({
        data: {},
        businessId: undefined,
        configurationId: undefined,
      }),
  }));
