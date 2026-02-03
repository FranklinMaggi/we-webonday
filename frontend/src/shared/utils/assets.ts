// ======================================================
// FE || shared/utils/assets.ts
// ======================================================
// RUOLO:
// - Costruzione URL asset pubblici (prompt / upload)
//
// PERCHE:
// - FE non deve hardcodare path
// - Bucket pubblico, nessuna API necessaria
// - Helper di sola presentazione
// ======================================================

export const PROMPT_IMAGES_BASE =
  "https://promptimg.webonday.it";

export type PromptImageKey =
  | "document-front"
  | "document-back"
  | "business-certificate"
  | "business-image";

const PROMPT_IMAGE_MAP: Record<PromptImageKey, string> = {
  "document-front": "prompt-cdi-fronte.png",
  "document-back": "prompt-cdi-retro.png",
  "business-certificate": "certi-business.png",
  "business-image": "upload-img.png",
};

export function getPromptImageUrl(
  key: PromptImageKey
): string {
  return `${PROMPT_IMAGES_BASE}/${PROMPT_IMAGE_MAP[key]}`;
}
