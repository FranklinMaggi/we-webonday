// ======================================================
// SHARED || DTO || CONFIGURATION PREVIEW
// PATH: src/shared/dto/configurationPreview.dto.ts
// ======================================================
//
// RUOLO:
// - Contratto BE → FE per la PREVIEW di una Configuration
// - Usato ESCLUSIVAMENTE dal Workspace / Preview
//
// INVARIANTI:
// - Read-only
// - Canvas già buildato (engine-ready)
// - Nessuna logica FE
// ======================================================

import type { EngineCanvas } from
  "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.schema.fe";

/**
 * Modalità di preview
 * - preview: editor / workspace
 * - live: simulazione sito pubblico
 */
export type ConfigurationPreviewMode =
  | "preview"
  | "live";

/**
 * DTO principale Preview
 */
export type ConfigurationPreviewDTO = {
  /**
   * ID configurazione
   */
  configurationId: string;

  /**
   * Modalità preview
   */
  mode: ConfigurationPreviewMode;

  /**
   * Canvas generato dall’engine
   * (Source of Truth UI)
   */
  canvas: EngineCanvas;

  /**
   * Timestamp generazione preview
   * (debug / invalidation)
   */
  generatedAt: string;
};