import { ITALY_CAPOLUOGHI, type ItalyCapoluogo } from "./italyCapoluoghi.data";

/* ======================================================
   NORMALIZER (UX FRIENDLY)
====================================================== */
function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ======================================================
   SEARCH — CITY AUTOCOMPLETE
====================================================== */
export function searchCapoluoghi(
  query: string,
  limit = 6
): ItalyCapoluogo[] {
  if (!query || query.trim().length < 2) return [];

  const q = normalize(query);

  return ITALY_CAPOLUOGHI
    .filter((c) => normalize(c.city).startsWith(q))
    .sort((a, b) => a.city.length - b.city.length)
    .slice(0, limit);
}
