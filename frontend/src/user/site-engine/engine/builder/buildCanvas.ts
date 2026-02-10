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

import type { EngineInput } from "../api/types/engine.types";
import type { EngineCanvas, CanvasSection } from "../../preview/api/types/engine.canvas";

export function buildCanvas(
  input: EngineInput
): EngineCanvas {
  const { business, layout, style, palette } = input;

  /* =====================
     NAVBAR
  ====================== */
  const navbar: CanvasSection | null =
    layout.structure.navbar
      ? {
          type: "navbar" as const,
          brandLabel: business.name,
          links: [
            { label: "Home", anchor: "#home" },
            { label: "Chi siamo", anchor: "#chi-siamo" },
            { label: "Gallery", anchor: "#gallery" },
            { label: "Contatti", anchor: "#contatti" },
          ],
        }
      : null;

  /* =====================
     FOOTER
  ====================== */
  const footer: CanvasSection = {
    type: "footer" as const,
    poweredBy: "WebOnDay",
    copyright:
      `© ${new Date().getFullYear()} ${business.name}`,
  };

  /* =====================
     HERO (SEMPRE PRESENTABILE)
  ====================== */
  const hero: CanvasSection = {
    type: "hero" as const,
    title: business.name,
    subtitle:
      business.sector !== "generic"
        ? business.sector
        : "Attività professionale",
    backgroundImage: "/preview/hero-default.jpg", // statica
    logoImage: undefined,
    logoPlaceholder: false,
  };

  /* =====================
     ACTIVITY
  ====================== */
  const activity: CanvasSection = {
    type: "activity" as const,
    label:
      business.sector !== "generic"
        ? business.sector
        : "La nostra attività",
  };

  /* =====================
     DESCRIPTION (MARKETING FALLBACK)
  ====================== */
  const description: CanvasSection = {
    type: "description" as const,
    text:
      business.descriptionText?.trim()
        ? business.descriptionText
        : business.sector !== "generic"
          ? `Scopri ${business.name}, un punto di riferimento nel settore ${business.sector}.`
          : `Scopri ${business.name}, un’attività pensata per offrire qualità e affidabilità.`,
  };
  

  /* =====================
     OPENING HOURS (CONDIZIONALE)
  ====================== */
  const openingHoursSection: CanvasSection[] =
    business.openingHours
      ? [
          {
            type: "opening-hours" as const,
            data: business.openingHours,
          },
        ]
      : [];

  /* =====================
     GALLERY (PLACEHOLDER VISIVO)
  ====================== */
  const gallery: CanvasSection = {
    type: "gallery" as const,
    images: [],
    placeholder: true, // ma SENZA testo editoriale
  };

  /* =====================
     LOCATION
  ====================== */
  const location: CanvasSection = {
    type: "location",
    address: business.address,
    mapsUrl: business.address
      ? `https://maps.google.com?q=${encodeURIComponent(
          business.address
        )}`
      : undefined,
  };

  /* =====================
     CANVAS
  ====================== */
  return {
    meta: {
      product: "iscrizione-gratuita",
      generatedAt: new Date().toISOString(),
      styleId: style,
      paletteId: palette,
    },

    business,

    layout: {
      type: "single-page",
      sections: [
        ...(navbar ? [navbar] : []),
        hero,
        activity,
        description,
        ...openingHoursSection,
        gallery,
        location,
        footer,
      ],
    },
  };
}
