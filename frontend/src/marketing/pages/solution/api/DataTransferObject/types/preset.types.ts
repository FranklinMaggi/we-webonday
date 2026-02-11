export type SitePresetPublicDTO = {
    id: string;
    solutionId: string;
    name: string;
    description: string;
  
    preview: {
      heroImageKey: string;
      galleryKeys?: string[];
    };
  
    overrides?: {
      styleId?: string;
      paletteId?: string;
    };
  
    features?: {
      gallery?: boolean;
      map?: boolean;
      booking?: boolean;
    };
  };
  