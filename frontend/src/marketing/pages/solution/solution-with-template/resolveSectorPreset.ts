

export function resolveSectorPreset(solutionId: string) {
    switch (solutionId) {
      case "bnb":
        return {
          layoutId: "layout-landing-espresso",
          features: {
            navbar: true,
            hero: true,
            gallery: true,
            openingHours: true,
            map: true,
            whatsapp: true,
            footer: true,
          },
          defaults: {
            styleId: "elegant",
            paletteId: "light",
          },
        };
  
      case "food":
        return {
          layoutId: "layout-landing-espresso",
          features: {
            navbar: true,
            hero: true,
            gallery: true,
            openingHours: true,
            map: true,
            whatsapp: true,
            footer: true,
          },
          defaults: {
            styleId: "elegant",
            paletteId: "corporate",
          },
        };
  
      case "ncc":
        return {
          layoutId: "layout-landing-espresso",
          features: {
            navbar: true,
            hero: true,
            gallery: false,
            openingHours: false,
            map: false,
            whatsapp: true,
            footer: true,
          },
          defaults: {
            styleId: "modern",
            paletteId: "dark",
          },
        };
  
      default:
        return {
          layoutId: "layout-landing-espresso",
          features: {
            navbar: true,
            hero: true,
            gallery: true,
            openingHours: false,
            map: false,
            whatsapp: true,
            footer: true,
          },
          defaults: {
            styleId: "neutral",
            paletteId: "light",
          },
        };
    }
  }
  