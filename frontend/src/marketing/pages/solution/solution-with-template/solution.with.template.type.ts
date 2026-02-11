export type SolutionWithTemplate = {
    id: string;
    name: string;
    templateSeed?: {
      layoutId: string;
      style: string;
      palette: string;
      sections: string[];
      galleryPreset?: {
        key: string;
        images: string[];
      };
      copySeed?: {
        heroTitle?: string;
        heroSubtitle?: string;
        description?: string;
      };
    };
  };
  