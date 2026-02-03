import { Solution } from "./schema/solution.schema";
import { PublicSolutionDTO } from "./DataTransferObject/solution.public.dto";
import { OpeningHoursFE } from "@domains/GeneralSchema/hours.opening.schema";
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
    openingHours:solution.openingHours, }
}
