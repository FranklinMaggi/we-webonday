import { normalizeTag } from "./normalizeTag";
import { SolutionSchema} from "./schema/solution.schema";


export function prepareSolutionInput(raw: any) {
  const normalized = {
    ...raw,

    userServiceTags: Array.isArray(raw.userServiceTags)
      ? raw.userServiceTags.map(normalizeTag)
      : [],

    serviceTags: Array.isArray(raw.serviceTags)
      ? raw.serviceTags.map(normalizeTag)
      : [],
  };

  // ORA validi
  return SolutionSchema.parse(normalized);
}
