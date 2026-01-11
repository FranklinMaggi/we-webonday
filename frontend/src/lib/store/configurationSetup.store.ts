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

/* =========================
   INITIAL DATA (STABILE)
========================= */
const initialData: Partial<UserConfigurationSetupDTO> = {
  /* BUSINESS */
  businessName: "",
  sector: "",

  address: "",
  city: "",
  state: "",
  zip: "",

  /* CONTACT */
  email: "",
  phone: "",
  privacyAccepted: false,

  /* TAGS */
  solutionTags: [],   // 🔴 CRITICO
  businessTags: [],   // 🔴 CRITICO

  /* COMMERCIAL */
  solutionId: "",
  productId: "",
  optionIds: [],

  /* VISIBILITY */
  visibility: {
    contactForm: true,
    address: true,
    gallery: true,
    openingHours: true,
    businessTags: [],
  },

  openingHours: {},
};

/* =========================
   STATE TYPE
========================= */
type ConfigurationSetupState = {
  data: Partial<UserConfigurationSetupDTO>;

  businessId?: string;
  configurationId?: string;

  setField<K extends keyof UserConfigurationSetupDTO>(
    key: K,
    value: UserConfigurationSetupDTO[K]
  ): void;

  setBusinessId(id: string): void;
  setConfigurationId(id: string): void;

  reset(): void;
};

/* =========================
   STORE
========================= */
export const useConfigurationSetupStore =
  create<ConfigurationSetupState>((set) => ({
    /* STATE */
    data: initialData,
    businessId: undefined,
    configurationId: undefined,

    /* MUTATORS */
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
        data: initialData,
        businessId: undefined,
        configurationId: undefined,
      }),
  }));
