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
 * - businessId è STATO TECNICO (non DTO)
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

  // =========================
  // MUTATORS
  // =========================
  setField<K extends keyof UserConfigurationSetupDTO>(
    key: K,
    value: UserConfigurationSetupDTO[K]
  ): void;

  setBusinessId(id: string): void;

  reset(): void;
};

export const useConfigurationSetupStore =
  create<ConfigurationSetupState>((set) => ({
    data: {},
    businessId: undefined,

    setField: (key, value) =>
      set((s) => ({
        data: {
          ...s.data,
          [key]: value,
        },
      })),

    setBusinessId: (id) =>
      set(() => ({ businessId: id })),

    reset: () =>
      set({
        data: {},
        businessId: undefined,
      }),
  }));
