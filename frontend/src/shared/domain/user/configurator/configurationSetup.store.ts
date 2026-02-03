import { create } from "zustand";
import type { ConfigurationSetupDTO } from "./configurationSetup.types";
import {
  EMPTY_OPENING_HOURS,
} from "@shared/domain/business/openingHours.constants";

/* =========================
   INITIAL STATE
========================= */
const initialState: ConfigurationSetupDTO = {
  configurationId: undefined,
  businessDraftId: undefined,

  solutionId: "",
  productId: "",
  optionIds: [],

  businessName: "",
  sector: "",

  email: "",
  phone: undefined,

  businessAddress: {
    street: "",
    number: "",
    city: "",
    province: "",
    region: "",
    country: "",
    zip: "",
  },

  openingHours: EMPTY_OPENING_HOURS,

  businessServiceTags: [],
  businessDescriptionTags: [],

  privacy: {
    accepted: false,
    acceptedAt: "",
    policyVersion: "",
  },

  ownerFirstName: "",
  ownerLastName: "",
  ownerBirthDate: undefined,
  ownerSecondaryMail: undefined,
  
  ownerAddress: {
    street: "",
    number: "",
    city: "",
    province: "",
    region: "",
    zip: "",
    country: "Italia",
  },

  
  ownerPrivacy: {
    accepted: false,
    acceptedAt: "",
    policyVersion: "",
  },
  ownerStepCompleted: false,
  layoutId: undefined,
  style: undefined,
  colorPreset: undefined,

  visibility: undefined,
};

/* =========================
   STORE
========================= */
type ConfigurationSetupState = {
  data: ConfigurationSetupDTO;

  setField<K extends keyof ConfigurationSetupDTO>(
    key: K,
    value: ConfigurationSetupDTO[K]
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
