// ======================================================
// FE || CONFIGURATION LAYOUT — LAYOUT KV DTO
// ======================================================
//
// AI-SUPERCOMMENT — LAYOUT DEFINITION (JSON → UI)
//
// RUOLO:
// - Rappresenta un layout COMPLETO e renderizzabile
// - Decodificato dal LayoutRenderer
// - Usato per preview, selezione e acquisto
//
// QUESTO È IL CUORE DEL SISTEMA
// ======================================================

import type { LayoutStyle } from "./style.dto";
import type { ColorPaletteId } from "./palette.dto";

/**
 * Identificatore layout
 * Esempio:
 * - layout-landing-essential
 */
export type LayoutId = string;

/**
 * Struttura di un Layout KV
 * Salvata in KV e interpretata lato FE
 */
export type LayoutKVDTO = {
  /**
   * ID layout stabile
   */
  id: LayoutId;

  /**
   * Versione layout
   * Usata per migrazioni future
   */
  version: string;

  /**
   * Nome commerciale
   */
  name: string;

  /**
   * Descrizione UX
   */
  description: string;

  /**
   * Stili compatibili
   */
  supportedStyles: LayoutStyle[];

  /**
   * Palette compatibili
   */
  supportedPalettes: ColorPaletteId[];

  /**
   * Struttura SPA dichiarativa
   * (NO JSX, NO HTML diretto)
   */
  structure: {
    navbar: boolean;
    hero: boolean;
    sections: Array<
      | "about"
      | "services"
      | "gallery"
      | "contact"
      | "map"
    >;
    footer: boolean;
  };

  /**
   * Placeholder dinamici
   * Verranno popolati da Business KV
   */
  bindings: {
    businessName: boolean;
    logo: boolean;
    address: boolean;
    phone: boolean;
    services: boolean;
  };

  /**
   * Regole di rendering
   */
  render: {
    /**
     * Usa CSS inline?
     */
    inlineCss: boolean;

    /**
     * Supporta preview blur (pre-pagamento)
     */
    previewBlur: boolean;
  };
};
