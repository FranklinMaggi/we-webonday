/**
 * ======================================================
 * FE || ConfigurationSetupStoreDTO (CANONICAL)
 * ======================================================
 *
 * RUOLO:
 * - Stato FE completo del configurator
 * - Workspace temporaneo
 *
 * SOURCE OF TRUTH:
 * - Backend per id / solutionId / productId / optionIds
 * - FE per il resto
 * ======================================================
 */
// ======================================================
// FE || Configuration Setup Store (Zustand)
// ======================================================
//
// RUOLO:
// - Stato FE temporaneo del configurator
// - NON persiste
// - NON fa fetch
//
// ======================================================

import { create } from "zustand";

const initialState: ConfigurationSetupStoreDTO = {
  configurationId: undefined,
  businessId: "",
  draftId:"",
  solutionId: "",
  productId: "",
  optionIds: [],
  /* =========================
     OWNER (NEW — FE ONLY)
  ========================= */
  ownerName: undefined,
  ownerEmail: undefined,
  ownerPhone: undefined,
  businessName: "",
  sector: "",

  email: "",
  phone: undefined,

  address: undefined,
  city: undefined,
  state: undefined,
  zip: undefined,

  openingHours: undefined,
  servicesTags: undefined,
  descriptionTags: undefined,

  solutionServiceTags: [],
  businessServiceTags: [],
  businessDescriptionTags: [],

  layoutId: undefined,
  style: undefined,
  colorPreset: undefined,

  visibility: undefined,

  privacyAccepted: false,
};

type ConfigurationSetupState = {
  data: ConfigurationSetupStoreDTO;

  setField<K extends keyof ConfigurationSetupStoreDTO>(
    key: K,
    value: ConfigurationSetupStoreDTO[K]
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


export type ConfigurationSetupStoreDTO = {
  /* =========================
     CORE (BE)
  ========================= */
  configurationId?: string;
  businessId?: string;

  solutionId: string;
  productId: string;
  optionIds: string[];
/* =========================
     OWNER (NEW — FE ONLY)
  ========================= */
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  /* =========================
     BUSINESS
  ========================= */
  businessName: string;
  sector: string;

  email: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  zip?: string;

  openingHours?: Record<string, string>;
  draftId?:string;

  servicesTags?: string;
  descriptionTags?: string;

  /* =========================
     TAGS
  ========================= */
  solutionServiceTags: string[];
  businessServiceTags: string[];
  businessDescriptionTags: string[];

  /* =========================
     DESIGN
  ========================= */
  layoutId?: string;
  style?: string;
  colorPreset?: string;

  visibility?: Record<string, boolean>;

  /* =========================
     META
  ========================= */
  privacyAccepted: boolean;
};
