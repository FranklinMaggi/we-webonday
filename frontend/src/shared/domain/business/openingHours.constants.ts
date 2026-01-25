import { type OpeningHoursFE } from "./openingHours.types";
export const EMPTY_OPENING_HOURS: OpeningHoursFE = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
  // ======================================================
// SHARED || DOMAIN || BUSINESS || OPENING HOURS CONSTANTS
// ======================================================
//
// RUOLO:
// - Costanti canoniche per OpeningHours (FE)
// - Ordine giorni, label, default
// ======================================================

import type { DayKey } from "./openingHours.types";

/**
 * Ordine canonico dei giorni (UI / FE)
 */
export const DAYS_ORDER: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/**
 * Label UI per giorni della settimana
 */
export const DAY_LABELS: Record<DayKey, string> = {
  monday: "Lunedì",
  tuesday: "Martedì",
  wednesday: "Mercoledì",
  thursday: "Giovedì",
  friday: "Venerdì",
  saturday: "Sabato",
  sunday: "Domenica",
};
