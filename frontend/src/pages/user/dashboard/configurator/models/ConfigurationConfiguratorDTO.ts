// ======================================================
// FE || ConfigurationConfiguratorDTO
// ======================================================
//
// RUOLO:
// - DTO MINIMO allineato al BE
// - Usato SOLO dal configurator
//
// ======================================================

export type ConfigurationConfiguratorDTO = {
  id: string;

  solutionId: string;
  productId: string;
  businessDraftId?:string; 
  options: string[];

  prefill?: {
    businessName: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      province?: string;
      zip?: string;}
  };

  businessServiceTags?: string[];
  businessDescriptionTags?: string[];




  status: string;

  createdAt?: string;
  updatedAt?: string;
};
