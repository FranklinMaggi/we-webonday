// ======================================================
// FE || CONFIGURATION LAYOUT — STYLE DTO
// ======================================================
//
// AI-SUPERCOMMENT — LAYOUT STYLE (INTENT)
//
// RUOLO:
// - Definisce lo STILE comunicativo del sito
// - Influenza spacing, font, gerarchie
//
// NON FA:
// - NON definisce layout specifici
// - NON contiene CSS
//
// CONCETTO:
// - Lo style è un’INTENZIONE, non una struttura
// ======================================================

/**
 * Stile semantico del layout
 */
export type LayoutStyle =
  | "modern"
  | "elegant"
  | "minimal"
  | "bold";

/**
 * Metadati descrittivi dello stile
 * (usati per UI, AI, spiegazioni UX)
 */
export type LayoutStyleDTO = {
  id: LayoutStyle;
  label: string;
  description: string;
};

/**
 * Elenco stili disponibili
 */
export const LAYOUT_STYLES: LayoutStyleDTO[] = [
  {
    id: "modern",
    label: "Moderno",
    description:
      "Layout attuale, leggibile, con spazi equilibrati e design contemporaneo.",
  },
  {
    id: "elegant",
    label: "Elegante",
    description:
      "Design raffinato, tipografia curata, ideale per brand premium.",
  },
  {
    id: "minimal",
    label: "Minimal",
    description:
      "Essenziale e pulito, focalizzato sui contenuti senza distrazioni.",
  },
  {
    id: "bold",
    label: "Bold",
    description:
      "Impatto forte, contrasti marcati, perfetto per attirare attenzione.",
  },
];
