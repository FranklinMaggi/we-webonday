// FE || DTO || BusinessCreateSchedaPayload

export interface BusinessCreateSchedaPayload {
    businessName: string;
  
    solutionId: string;
    productId: string;
    configurationId:string; 
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
    privacy:{
      accepted:boolean,
      acceptedAt: string ,
      policyVersion:string,
    },
    businessDescriptionTags: string[];
    businessServiceTags: string[];
  
  }
  