export type SiteTemplateDTO = {
    presetId: string;          // "food-landing-free"
    productId: string;         // "iscrizione-gratuita" | "landing-essential"
    label: string;
    description: string;
  
    build: {
      layoutId: string;        // "layout-landing-essential"
      styleId: string;         // "elegant"
      paletteId: string;       // "corporate"
  
      renderIntents: {
        hero?: {
          alignment?: "left" | "center";
        };
  
        logo?: {
          position: "left" | "center" | "right";
          overlap: "none" | "half";
          shape: "circle" | "rounded" | "square";
        };
  
        cta?: {
          type: "whatsapp";
          position: "bottom-right";
          iconShape: "circle";
        };
      };
    };
  
    features: {
      gallery: boolean;
      openingHours: boolean;
      contactForm: boolean;
  
      menu?: {
        enabled: boolean;
        mode: "preview" | "interactive";
      };
    };
  
    sections: Array<
      | "hero"
      | "activity"
      | "description"
      | "gallery"
      | "opening-hours"
      | "contact"
    >;
  };
  