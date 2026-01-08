// ======================================================
// FE || CONFIGURATION LAYOUT — COLOR PALETTE DTO
// ======================================================
//
// AI-SUPERCOMMENT — COLOR PALETTE (SEMANTIC)
//
// RUOLO:
// - Definisce le palette colori DISPONIBILI
// - Usate dal wizard (StepDesign)
// - Interpretate dal LayoutRenderer
//
// NON FA:
// - NON contiene CSS
// - NON contiene hex hardcoded nello store
// - NON decide il layout
//
// PRINCIPIO CHIAVE:
// - La palette è un CONCETTO, non un colore
// ======================================================

/**
 * Identificatore semantico di una palette colori
 * Usato come reference nello store FE
 */
export type ColorPaletteId =
  | "warm"
  | "dark"
  | "light"
  | "pastel"
  | "corporate";

/**
 * Definizione di una palette colori
 * (interpretata dal renderer)
 */
export type ColorPaletteDTO = {
  /**
   * ID stabile (salvato nello store)
   */
  id: ColorPaletteId;

  /**
   * Label mostrata all’utente
   */
  label: string;

  /**
   * Colori base (preview / renderer)
   * NOTA:
   * - Questi NON vanno salvati nello store
   * - Possono evolvere nel tempo
   */
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
};

/**
 * Elenco palette disponibili
 * SOURCE OF TRUTH per StepDesign
 */
export const COLOR_PRESETS: ColorPaletteDTO[] = [
  {
    id: "warm",
    label: "Caldo e accogliente",
    colors: {
      primary: "#d97706",
      secondary: "#fde68a",
      background: "#fff7ed",
      text: "#451a03",
    },
  },
  {
    id: "dark",
    label: "Scuro moderno",
    colors: {
      primary: "#0f172a",
      secondary: "#334155",
      background: "#020617",
      text: "#f8fafc",
    },
  },
  {
    id: "light",
    label: "Chiaro essenziale",
    colors: {
      primary: "#2563eb",
      secondary: "#93c5fd",
      background: "#ffffff",
      text: "#020617",
    },
  },
  {
    id: "pastel",
    label: "Pastello creativo",
    colors: {
      primary: "#a855f7",
      secondary: "#fbcfe8",
      background: "#fdf4ff",
      text: "#3b0764",
    },
  },
  {
    id: "corporate",
    label: "Corporate professionale",
    colors: {
      primary: "#0f766e",
      secondary: "#5eead4",
      background: "#f0fdfa",
      text: "#042f2e",
    },
  },
];
