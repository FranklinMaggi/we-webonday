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


// ======================================================
// BE || utils/assets.ts
// ======================================================
// SEZIONE: PUBLIC PROMPT IMAGES (UPLOAD PLACEHOLDERS)
//
// RUOLO:
// - Esporre URL pubblici per riquadri di upload documenti / immagini
//
// PERCHE:
// - Asset statici, pubblici
// - Nessun controllo runtime necessario
// - FE non deve conoscere path o bucket
// ======================================================

/**
 * Base URL bucket immagini prompt / upload
 * Bucket pubblico R2
 */
export const PROMPT_IMAGES_BASE =
  "https://promptimg.webonday.it";

/**
 * Enum logico dei prompt disponibili
 * (nomi SEMANTICI, non file)
 */
export type PromptImageKey =
  | "document-front"
  | "document-back"
  | "business-certificate"
  | "business-image";

/**
 * Mappa SEMANTICA → file fisico
 * PNG only (invariante)
 */
const PROMPT_IMAGE_MAP: Record<PromptImageKey, string> = {
  "document-front": "prompt-cdi-fronte.png",
  "document-back": "prompt-cdi-retro.png",
  "business-certificate": "certi-business.png",
  "business-image": "upload-img.png",
};

/**
 * Ritorna URL pubblico dell’immagine prompt
 *
 * @example
 * getPromptImageUrl("document-front")
 */
export function getPromptImageUrl(key: PromptImageKey): string {
  return `${PROMPT_IMAGES_BASE}/${PROMPT_IMAGE_MAP[key]}`;
}
