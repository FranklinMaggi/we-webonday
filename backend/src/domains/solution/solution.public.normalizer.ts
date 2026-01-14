import { Solution } from "./solution.schema";
import { PublicSolutionDTO } from "./solution.public.dto";

export function normalizeSolutionToPublic(
  solution: Solution
): PublicSolutionDTO {
  return {
    id: solution.id,
    name: solution.name,

    // 🔑 QUI RISOLVI IL BUG
    description: solution.description ?? "",

    imageKey: solution.imageKey,
    icon: solution.icon,
    industries: solution.industries ?? [],

    // ⬇️ PASSI IL SEED SOLO SE ESISTE
    openingHoursDefault: solution.openingHoursDefault
      ? {
          monday: solution.openingHoursDefault.monday,
          tuesday: solution.openingHoursDefault.tuesday,
          wednesday: solution.openingHoursDefault.wednesday,
          thursday: solution.openingHoursDefault.thursday,
          friday: solution.openingHoursDefault.friday,
          saturday: solution.openingHoursDefault.saturday,
          sunday: solution.openingHoursDefault.sunday,
        }
      : undefined,
  };
}
