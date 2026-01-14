export type PublicSolutionDetailDTO = {
    id: string;
    name: string;
    description?: string;
    longDescription?: string;
  
    image?: {
      hero: string;
      card: string;
      fallback?: string;
    };
  
    industries: string[];
  
    descriptionTags: string[];
    serviceTags: string[];
  
    openingHoursDefault?: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
  };
  