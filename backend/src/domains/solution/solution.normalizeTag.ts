/**
 * ======================================================
 * TAG NORMALIZER (CANONICAL)
 *
 * RUOLO:
 * - Normalizza input umano → dominio tecnico
 *
 * GARANZIE:
 * - lowercase
 * - kebab-case
 * - no caratteri illegali
 *
 * NOTE:
 * - NON valida
 * - NON filtra semantica
 * ======================================================
 */
export function normalizeTag(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  