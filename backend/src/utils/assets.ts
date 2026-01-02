// ======================================================
// BE || utils/assets.ts
// ======================================================
// RUOLO:
// - Costruzione URL asset pubblici (R2)
//
// PERCHE:
// - Il FE non deve mai costruire path
// - Un solo punto di verità
// ======================================================

export const SOLUTIONS_ASSETS_BASE =
  "https://solutionsimg.webonday.it";

export function getSolutionImageUrl(imageKey?: string) {
  const key = imageKey ?? "default.jpg";
  return `${SOLUTIONS_ASSETS_BASE}/solutions/${key}`;
}
