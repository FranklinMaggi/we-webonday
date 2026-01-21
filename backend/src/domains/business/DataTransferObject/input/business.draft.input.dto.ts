/* ======================================================
   DOMAIN || BUSINESS || BASE DTO
======================================================

RUOLO:
- DTO canonico per Business in fase di CREAZIONE
- Usato da:
  - FE (BusinessForm)
  - POST /api/business/create
  - Persistenza KV iniziale

INVARIANTI:
- Rappresenta un Business DRAFT
- Non contiene media caricata
- Non contiene stato ACTIVE
====================================================== */
export interface BusinessDraftInputDTO {
    configurationId: string; // draftId
    businessDraftId:string; 
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
  