import { Solution } from "./schema/solution.schema";
import { PublicSolutionDTO } from "./solution.public.dto";

export function normalizeSolutionToPublic(
  solution: Solution
): PublicSolutionDTO {
  return {
    id: solution.id,
    name: solution.name,
    description: solution.description ?? "",

    imageKey: solution.imageKey,
    icon: solution.icon,
    industries: solution.industries ?? [],
    descriptionTags: solution.descriptionTags ?? [],
    serviceTags:solution.serviceTags ?? [],
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
