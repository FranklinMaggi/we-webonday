import type { OpeningHoursFE } from "./openingHours.types";

/**
 * Ritorna TRUE se tutti i giorni hanno zero time range
 */
export function isOpeningHoursEmpty(
  openingHours: OpeningHoursFE | null | undefined
): boolean {
  if (!openingHours) return true;

  return Object.values(openingHours).every((dayRanges) => {
    return !Array.isArray(dayRanges) || dayRanges.length === 0;
  });
}
