// FE || DTO || BusinessCreateSchedaPayload

export interface BusinessCreateSchedaPayload {
    businessName: string;
  
    solutionId: string;
    productId: string;

    businessOpeningHour: Record<string, unknown>;
  
    contact: {
      address?: {
        street?: string;
        city?: string;
        province?: string;
        zip?: string;
      };
      phoneNumber?: string;
      mail: string;
      pec?: string;
    };
  
    businessDescriptionTags: string[];
    businessServiceTags: string[];
  
  }
  