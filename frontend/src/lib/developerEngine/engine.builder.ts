// ======================================================
// FE || DEVELOPER ENGINE — CANVAS BUILDER
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

  const sections: CanvasSection[] = [];

  if (layout.structure.navbar) {
    sections.push({
      type: "navbar",
      brandLabel: business.name,
      links: [
        { label: "Home", anchor: "#home" },
        { label: "Galleria", anchor: "#gallery" },
        { label: "Dove siamo", anchor: "#location" },
        { label: "Contatti", anchor: "#contact" },
      ],
    });
  }

  if (layout.structure.hero) {
    sections.push({
      type: "hero",
      title: business.name,
      backgroundImage: `/img/hero-${business.slug}.png`,
    });
  }

  if (layout.structure.sections.includes("gallery")) {
    sections.push({
      type: "gallery",
      images: [],
      placeholder: true,
    });
  }

  sections.push({
    type: "activity",
    label: business.sector,
  });

  sections.push({
    type: "description",
    text: "Descrizione generata dai tag e contenuti business.",
  });

  sections.push({
    type: "location",
    address: business.address,
    mapsUrl: `https://maps.google.com?q=${encodeURIComponent(
      business.address
    )}`,
  });

  sections.push({
    type: "footer",
    poweredBy: "WebOnDay",
    copyright:
      `© ${new Date().getFullYear()} ${business.name}`,
  });

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
      sections,
    },
  };
}
