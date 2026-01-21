// FE || DTO || BusinessDraft (READ)
export interface BusinessDraftDTO {
  id: string; // ← allineato al BE

  businessName: string;
  solutionId: string;
  productId: string;

  businessOpeningHour: Record<string, unknown>;

  contact: {
    mail: string;
    phoneNumber?: string;
    pec?: string;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      zip?: string;
    };
  };
  privacy: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };
  businessDescriptionTags: string[];
  businessServiceTags: string[];

  verified: false;
}
