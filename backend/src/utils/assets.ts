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
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function stripExtension(key: string) {
  return key.replace(/\.(jpg|jpeg|png|webp)$/i, "");
}

export const SOLUTIONS_ASSETS_BASE =
  "https://solutionsimg.webonday.it";

export function getSolutionImageUrl(imageKey?: string) {
  const key = imageKey ?? "default.jpg";
  return `${SOLUTIONS_ASSETS_BASE}/solutions/${key}`;

}

export function getSolutionImages(imageKey?: string) {
  if (!imageKey) return undefined;
  const base = stripExtension(imageKey);
  return {
    hero: `${SOLUTIONS_ASSETS_BASE}/solutions/${base}-hero.jpg`,
    card: `${SOLUTIONS_ASSETS_BASE}/solutions/${base}-card.jpg`,
    fallback: `${SOLUTIONS_ASSETS_BASE}/solutions/${base}.jpg`,
  };
}
