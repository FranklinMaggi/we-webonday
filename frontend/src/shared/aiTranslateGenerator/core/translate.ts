import { FALLBACK_BY_LOCALE } from "../fallback";
import type { CopyMap, Locale } from "./types";

let BE_COPY: CopyMap = {};
let CURRENT_LOCALE: Locale = "it";

export function initFeTranslations(
  copyFromBe: CopyMap,
  locale: Locale = "it"
) {
  BE_COPY = copyFromBe ?? {};
  CURRENT_LOCALE = locale;
}

export function t(
  key: string,
  params?: Record<string, string | number>
): string {
  const fallback =
    FALLBACK_BY_LOCALE[CURRENT_LOCALE] ??
    FALLBACK_BY_LOCALE.it;

  let text =
    BE_COPY[key] ??
    fallback[key] ??
    key; // debug visivo

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{{${k}}}`, String(v));
    }
  }

  return text;
}
