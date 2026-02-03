// ======================================================
// FE || DEVELOPER ENGINE — CANVAS BUILDER
// ======================================================
//
// RUOLO:
// - Costruire EngineCanvas a partire da EngineInput
//
// INVARIANTI:
// - Nessun crash possibile
// - Builder deterministico
// - Usa SOLO dati già adattati
// ======================================================

import type { EngineInput } from "./engine.types";
import type {
  EngineCanvas,
  CanvasSection,
} from "./engine.schema.fe";

export function buildCanvas(
  input: EngineInput
): EngineCanvas {
  const { business, layout, style, palette } = input;

  /* =====================
     SHARED SECTIONS
  ====================== */
  const navbar: CanvasSection | null =
    layout.structure.navbar
      ? {
          type: "navbar" as const ,
          brandLabel: business.name,
          links: [
            { label: "Home", anchor: "/home" },
            { label: "Chi siamo", anchor: "/chi-siamo" },
            { label: "Gallery", anchor: "/gallery" },
            { label: "Contatti", anchor: "/contatti" },
          ],
        }
      : null;

  const footer: CanvasSection = {
    type: "footer" as const ,
    poweredBy: "WebOnDay",
    copyright:
      `© ${new Date().getFullYear()} ${business.name}`,
  };


  /* =====================
     CANVAS
  ====================== */
  return {
    meta: {
      product: "landing-essential",
      generatedAt: new Date().toISOString(),
      styleId: style,
      paletteId: palette,
    },
  
    business,
  
    layout: {
      type: "single-page",
  
      sections: [
        ...(navbar ? [navbar] : []),
  
        {
          type: "hero" as const ,
          title: business.name,
          subtitle:
            business.sector !== "generic"
              ? business.sector
              : undefined,
        },
  
        {
          type: "activity" as const ,
          label: business.sector,
        },
  
        {
          type: "description" as const ,
          text:
            "Descrizione dell’attività (inserisci i contenuti per personalizzare il sito).",
        },
  
        ...(business.openingHours
          ? [
              {
                type: "opening-hours" as const ,
                data: business.openingHours,
              },
            ]
          : []),
  
        {
          type: "location",
          address: business.address,
          mapsUrl: business.address
            ? `https://maps.google.com?q=${encodeURIComponent(
                business.address
              )}`
            : undefined,
        },
  
        footer,
      ],
    },
  };}