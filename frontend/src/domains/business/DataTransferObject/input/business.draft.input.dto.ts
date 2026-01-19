export interface BusinessDraftDTO {
    id: string; // draftId
  
    businessName: string;
  
    solutionId: string;
    productId: string;
  
    openingHours?: Record<string, unknown>;
  
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
  
    descriptionTags: string[];
    serviceTags: string[];
  
    verified: false;
  }
  