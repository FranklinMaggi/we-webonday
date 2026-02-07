// src/user/site-preview/api/types/preview.payload.ts

import type { EngineCanvas } from "../../frontend-preview/api/types/engine.canvas";
import type { EngineInput } from "./engine.types";

/**
 * Payload canonico per la Site Preview
 * - Supporta BE-driven
 * - Supporta FE fallback (demo / preset)
 */
export type FrontendPreviewPayload =
  | {
      source: "backend";
      mode: "preview" | "live";
      canvas: EngineCanvas;
      generatedAt: string;
    }
  | {
      source: "frontend";
      mode: "preview";
      engineInput: EngineInput;
      presetId?: string; // es. "demo-corporate"
    };
