// ======================================================
// FE || WORKSPACE PREVIEW — NORMALIZERS
// ======================================================
//
// RUOLO:
// - Allineare stringhe libere → union tipizzate
// - Evitare crash engine
// - Centralizzare fallback
// ======================================================

import type { LayoutStyle } from
  "@src/user/site-engine/engine/api/types/style.dto";

import type { ColorPaletteId } from
  "@src/user/site-engine/engine/api/types/palette.dto";

import { LAYOUT_STYLES } from
  "@src/user/site-engine/engine/api/types/style.dto";

import { COLOR_PRESETS } from
  "@src/user/site-engine/engine/api/types/palette.dto";

/* =========================
   STYLE
========================= */
export function normalizeLayoutStyle(
  value?: string
): LayoutStyle {
  const ids = LAYOUT_STYLES.map(s => s.id);
  return ids.includes(value as LayoutStyle)
    ? (value as LayoutStyle)
    : "elegant";
}

/* =========================
   PALETTE
========================= */
export function normalizePalette(
  value?: string
): ColorPaletteId {
  const ids = COLOR_PRESETS.map(p => p.id);
  return ids.includes(value as ColorPaletteId)
    ? (value as ColorPaletteId)
    : "corporate";
}
