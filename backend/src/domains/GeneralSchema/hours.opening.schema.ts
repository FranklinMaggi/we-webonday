// ======================================================
// SHARED || DOMAIN || BUSINESS || OPENING HOURS SCHEMA
// ======================================================
//
// SOURCE OF TRUTH
//
// RUOLO:
// - Validazione orari di apertura
// - Allineamento FE / BE
// - Usato da:
//   • BusinessDraftSchema
//   • BusinessSchema
//   • Configurator FE
//   • Preview / Dashboard
//
// INVARIANTI:
// - Giorni tipizzati
// - HH:mm obbligatorio
// - Nessun giorno mancante
// ======================================================

import { z } from "zod";

/* =========================
   COSTANTI CANONICHE
========================= */

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
   TIME RANGE
========================= */

export const TimeRangeSchema = z.object({
  from: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "INVALID_TIME_FORMAT"),
  to: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "INVALID_TIME_FORMAT"),
});

export type TimeRangeDTO = z.infer<typeof TimeRangeSchema>;

/* =========================
   OPENING HOURS (CANONICAL)
========================= */

export const OpeningHoursSchema = z.object({
  monday: z.array(TimeRangeSchema).default([]),
  tuesday: z.array(TimeRangeSchema).default([]),
  wednesday: z.array(TimeRangeSchema).default([]),
  thursday: z.array(TimeRangeSchema).default([]),
  friday: z.array(TimeRangeSchema).default([]),
  saturday: z.array(TimeRangeSchema).default([]),
  sunday: z.array(TimeRangeSchema).default([]),
});

export type OpeningHoursDTO = z.infer<typeof OpeningHoursSchema>;

/* =========================
   FE ALIAS (EXPLICIT)
========================= */

/**
 * FE canonical type
 * (alias diretto del DTO)
 */
export type OpeningHoursFE = OpeningHoursDTO;

/* =========================
   DEFAULT / EMPTY
========================= */

export const EMPTY_OPENING_HOURS: OpeningHoursFE = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

/* =========================
   HELPERS
========================= */

/**
 * TRUE se tutti i giorni sono vuoti
 */
export function isOpeningHoursEmpty(
  openingHours?: OpeningHoursFE | null
): boolean {
  if (!openingHours) return true;

  return DAYS_ORDER.every(
    (day) =>
      !Array.isArray(openingHours[day]) ||
      openingHours[day].length === 0
  );
}
