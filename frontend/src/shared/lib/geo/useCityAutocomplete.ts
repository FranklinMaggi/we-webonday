import { useMemo } from "react";
import { searchCapoluoghi } from "./italyCapoluoghi.utils";

export function useCityAutocomplete(cityInput: string) {
  const suggestions = useMemo(() => {
    return searchCapoluoghi(cityInput);
  }, [cityInput]);

  return {
    suggestions,
    hasSuggestions: suggestions.length > 0,
  };
}
