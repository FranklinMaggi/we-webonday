// ======================================================
// FE || marketing/pages/home/home.classes.ts
// ======================================================
// HOME PAGE — CLASS REGISTRY (LOCAL)
//
// Responsabilità:
// - Mappare classi semantiche della Home
// - Struttura gerarchica (page / section / hero)
// - Nessun CSS
// ======================================================

export const homePageClasses = {
  /* ======================================================
     PAGE
  ====================================================== */
  page: {
    shell: "page-shell page-home",
    layout: "page-layout page-layout--vertical",
  },

  /* ======================================================
     SECTIONS
  ====================================================== */
  section: {
    hero: "page-section page-section--hero",
    why: "page-section page-section--why",
  },

  /* ======================================================
     HERO
  ====================================================== */
  hero: {
    content: "home-hero",
    title: "home-hero__title",
    subtitle: "home-hero__subtitle",

    form: {
      wrapper: "home-hero__form",
      hint: "home-hero__hint",
      cta: "home-hero__cta",
    },
  },

  /* ======================================================
     WHY SECTION (future)
  ====================================================== */
  why: {
    title: "why-title",
    content: "why-content",
    list: "why-list",
    footer: "why-footer",
    links: "why-links",
  },
};