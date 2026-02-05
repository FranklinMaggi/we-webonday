import { OpeningHoursSchema, type OpeningHoursDTO } from "@domains/GeneralSchema/hours.opening.schema"
 /**  Normalizza OpeningHours legacy / parziali
 *
 * - Garantisce tutti i giorni
 * - Scarta valori invalidi
 * - NON interpreta stringhe magiche
 * - Source of truth: OpeningHoursSchema
 */
export function normalizeOpeningHours(
  raw?: Partial<Record<string, unknown>>
): OpeningHoursDTO {

  const result: OpeningHoursDTO = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  if (!raw) {
    return OpeningHoursSchema.parse(result);
  }

  for (const day of Object.keys(result) as (keyof OpeningHoursDTO)[]) {
    const value = raw[day];

    if (!Array.isArray(value)) {
      result[day] = [];
      continue;
    }

    result[day] = value
      .filter(
        (r): r is { from: string; to: string } =>
          typeof r === "object" &&
          r !== null &&
          typeof (r as any).from === "string" &&
          typeof (r as any).to === "string"
      )
      .map((r) => ({
        from: r.from.trim(),
        to: r.to.trim(),
      }));
  }

  return OpeningHoursSchema.parse(result);
}
