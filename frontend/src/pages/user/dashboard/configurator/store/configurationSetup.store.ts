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
  businessDraftId: undefined,
  sector :"",
  solutionId: "",
  productId: "",
  optionIds: [],

  /* =========================
     BUSINESS
  ========================= */
  businessName: "",

  email: "",
  phone: undefined,

  address: undefined,
  city: undefined,
  state: undefined,
  zip: undefined,

  openingHours: undefined,

  businessServiceTags: [],
  businessDescriptionTags: [],

  privacy: {
    accepted: false,
    acceptedAt: "",
    policyVersion: "",
  },

  /* =========================
     OWNER
  ========================= */
  ownerFirstName: "",
  ownerLastName: "",
  ownerBirthDate: undefined,
  ownerSecondaryMail: undefined,

  ownerPrivacy: {
    accepted: false,
    acceptedAt: "",
    policyVersion: "",
  },

  /* =========================
     DESIGN
  ========================= */
  layoutId: undefined,
  style: undefined,
  colorPreset: undefined,

  visibility: undefined,
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
       CORE (BE — READ / WRITE)
    ========================= */
    configurationId?: string;
    businessDraftId?: string;
  
    solutionId: string;
    productId: string;
    optionIds: string[];
  
    /* =========================
       BUSINESS
    ========================= */
    businessName: string;
    sector :string,
    email: string;
    phone?: string;
  
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  
    openingHours?: Record<string, string>;
  
    businessServiceTags: string[];
    businessDescriptionTags: string[];
  
    /* =========================
       BUSINESS PRIVACY
    ========================= */
    privacy: {
      accepted: boolean;
      acceptedAt: string;
      policyVersion: string;
    };
  
    /* =========================
       OWNER (FE ↔ BE)
    ========================= */
    ownerFirstName: string;
    ownerLastName: string;
    ownerBirthDate?: string;
    ownerSecondaryMail?: string;
  
    ownerPrivacy: {
      accepted: boolean;
      acceptedAt: string;
      policyVersion: string;
    };
  
    /* =========================
       DESIGN / WORKSPACE
    ========================= */
    layoutId?: string;
    style?: string;
    colorPreset?: string;
  
    visibility?: Record<string, boolean>;
  };
  
