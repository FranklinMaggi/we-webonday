/**
 * ======================================================
 * DOMAIN || OPENING HOURS — FE CANONICAL TYPES
 * ======================================================
 *
 * RUOLO:
 * - Modello FE canonico per orari di apertura
 * - Usato in:
 *   • Configurator
 *   • Business preview
 *   • Dashboard / You
 *
 * INVARIANTI:
 * - NO stringhe libere
 * - Chiavi giorni tipizzate
 * ======================================================
 */

export type TimeRangeFE = {
    from: string; // "HH:mm"
    to: string;   // "HH:mm"
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
  
  export type OpeningHoursFE = Record<DayKey, TimeRangeFE[]>;
  