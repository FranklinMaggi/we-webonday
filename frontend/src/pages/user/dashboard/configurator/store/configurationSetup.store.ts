/**
 * ======================================================
 * FE || CONFIGURATION SETUP STORE (CANONICAL)
 * ======================================================
 *
 * RUOLO:
 * - Stato FE temporaneo del wizard di configurazione
 *
 * SOURCE OF TRUTH:
 * - Backend (ConfigurationConfiguratorDTO)
 *
 * INVARIANTI:
 * - Stato SOLO frontend
 * - Nessuna fetch
 * - Nessuna persistenza diretta
 * - Resettato a ogni mount del configurator
 *
 * ======================================================
 */
import { create } from "zustand";
import type { UserConfigurationSetupDTO } from "../models/ConfigurationSetup.store-model";

/* =========================
   INITIAL STATE
========================= */
const initialState: UserConfigurationSetupDTO = {
  /* STEP 1 */
  solutionId: "",
  optionIds: [],

  /* STEP 2 */
  businessName: "",
  sector: "",
  email: "",
  phone: "",
  privacyAccepted: false,

  /* STEP 3 */
  solutionServiceTags: [],
  businessServiceTags: [],
  businessDescriptionTags: [],
};

type ConfigurationSetupState = {
  data: UserConfigurationSetupDTO;

  setField<K extends keyof UserConfigurationSetupDTO>(
    key: K,
    value: UserConfigurationSetupDTO[K]
  ): void;

  reset(): void;
};

export const useConfigurationSetupStore =
  create<ConfigurationSetupState>((set) => ({
    data: initialState,

    setField: (key, value) =>
      set((state) => ({
        data: {
          ...state.data,
          [key]: value,
        },
      })),

    reset: () => set({ data: initialState }),
  }));
