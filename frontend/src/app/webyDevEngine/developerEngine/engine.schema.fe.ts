// ======================================================
// FE || DEVELOPER ENGINE — CANVAS SCHEMA
// File: engine.schema.fe.ts
// ======================================================
//
// RUOLO:
// - Descrive il CANVAS astratto di una SPA
// - Source of Truth della UI generata
//
// NON FA:
// - NON renderizza
// - NON conosce React / HTML / CSS
//
// FA:
// - Descrive struttura, contenuto, intenzione
// ======================================================

export type EngineCanvas = {
    meta: {
      product: "landing-essential";
      generatedAt: string;
      styleId: string;
      paletteId: string;
    };
  
    business: {
      name: string;
      slug: string;
      sector: string;
      address: string;
      mapsUrl?: string;
    };
  
    layout: {
      type: "single-page";
      sections: CanvasSection[];
    };
  };
  
  /* =========================
     SECTIONS
  ========================= */
  export type CanvasSection =
    | NavbarSection
    | HeroSection
    | GallerySection
    | ActivitySection
    | DescriptionSection
    | LocationSection
    | FooterSection;
  
  /* =========================
     NAVBAR
  ========================= */
  export type NavbarSection = {
    type: "navbar";
    brandLabel: string;
    links: {
      label: string;
      anchor: string;
    }[];
  };
  
  /* =========================
     HERO
  ========================= */
  export type HeroSection = {
    type: "hero";
    title: string;
    backgroundImage: string;
  };
  
  /* =========================
     GALLERY
  ========================= */
  export type GallerySection = {
    type: "gallery";
    images: string[];
    placeholder: boolean;
  };
  
  /* =========================
     ACTIVITY
  ========================= */
  export type ActivitySection = {
    type: "activity";
    label: string;
  };
  
  /* =========================
     DESCRIPTION
  ========================= */
  export type DescriptionSection = {
    type: "description";
    text: string;
  };
  
  /* =========================
     LOCATION
  ========================= */
  export type LocationSection = {
    type: "location";
    address: string;
    mapsUrl: string;
  };
  
  /* =========================
     FOOTER
  ========================= */
  export type FooterSection = {
    type: "footer";
    poweredBy: string;
    copyright:
      string;
  };
  