import { z } from "zod";
import { OpeningHoursSchema } from "./schema/business.schema";

type RawOpeningHours = Record<string, unknown>;
type NormalizedOpeningHours = z.infer<typeof OpeningHoursSchema>;

export function normalizeDraftOpeningHours(
  raw: RawOpeningHours | undefined
): NormalizedOpeningHours {
  const days = [
    "monday","tuesday","wednesday",
    "thursday","friday","saturday","sunday",
  ] as const;

  const result = {} as NormalizedOpeningHours;

  for (const day of days) {
    const value = String(raw?.[day] ?? "").trim();

    if (!value || value === "Chiuso") {
      result[day] = [];
      continue;
    }

    if (value === "H24") {
      result[day] = [{ from: "00:00", to: "24:00" }];
      continue;
    }

    const ranges = value.split(" / ");

    result[day] = ranges.map((r) => {
      const [from, to] = r.split(" - ");
      return { from, to };
    });
  }

  return OpeningHoursSchema.parse(result);
}
