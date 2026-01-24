// ======================================================
// FE || utils/businessTags.ts
// ======================================================
//
// SINGLE SOURCE OF TRUTH — TAG HANDLING
//
// - Normalizza input umano
// - Deduplica
// - Garantisce formato SEO-safe
// ======================================================

export function normalizeBusinessTags(
  raw: string | string[] | undefined
): string[] {
  if (!raw) return [];

  const items = Array.isArray(raw)
    ? raw
    : raw.split(",");

  const normalized = items
    .map((item) =>
      item
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    )
    .filter(Boolean);

  // dedupe
  return Array.from(new Set(normalized));
}

export function normalizeTags(
    raw: string | string[] | undefined
  ): string[] {
    if (!raw) return [];
  
    const items = Array.isArray(raw)
      ? raw
      : raw.split(",");
  
    const normalized = items
      .map((item) =>
        item
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      )
      .filter(Boolean);
  
    // dedupe
    return Array.from(new Set(normalized));
  }
  