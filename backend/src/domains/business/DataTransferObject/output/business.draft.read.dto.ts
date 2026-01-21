// BE ...busines/DataTransefObject/output/business.draft.read.dto.ts|| DTO || BusinessDraftBaseReadDTO
export type BusinessDraftBaseReadDTO = {
    businessDraftId: string; // businessDraftId
  
    businessName: string;
    solutionId: string;
    productId: string;
  
    businessOpeningHour?: Record<string, unknown>;
  
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
  
    verified: false;
  };
  