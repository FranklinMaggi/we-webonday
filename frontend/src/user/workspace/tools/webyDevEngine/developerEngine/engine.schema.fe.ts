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
import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";
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
  export type OpeningHoursSection = {
    type: "opening-hours";
    data: OpeningHoursFE;
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
  | FooterSection
  | OpeningHoursSection; 
  
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
    backgroundImage?: string; 
    subtitle?: string;
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
    mapsUrl?: string; // ⬅️ FIX
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
  