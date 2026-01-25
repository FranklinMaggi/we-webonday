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

import { create } from "zustand";

/* =========================
   OPENING HOURS — FE MODEL
   (NO STRINGHE LIBERE)
========================= */
export type TimeRangeFE = {
  from: string; // "HH:mm"
  to: string;   // "HH:mm"
};

export type OpeningHoursFE = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  TimeRangeFE[]
>;


/* =========================
   DTO — STORE
========================= */
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
  sector: string;

  email: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  zip?: string;

  openingHours: OpeningHoursFE;

  businessServiceTags: string[];
  businessDescriptionTags: string[];

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

/* =========================
   EMPTY OPENING HOURS
   (DETERMINISTIC)
========================= */
const emptyOpeningHours: OpeningHoursFE = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};
export const DAYS_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export type DayKey = typeof DAYS_ORDER[number];
/* =========================
   INITIAL STATE
========================= */
const initialState: ConfigurationSetupStoreDTO = {
  configurationId: undefined,
  businessDraftId: undefined,

  solutionId: "",
  productId: "",
  optionIds: [],

  businessName: "",
  sector: "",

  email: "",
  phone: undefined,

  address: undefined,
  city: undefined,
  state: undefined,
  zip: undefined,

  openingHours: emptyOpeningHours,

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

  ownerPrivacy: {
    accepted: false,
    acceptedAt: "",
    policyVersion: "",
  },

  layoutId: undefined,
  style: undefined,
  colorPreset: undefined,

  visibility: undefined,
};

/* =========================
   ZUSTAND STORE
========================= */
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
