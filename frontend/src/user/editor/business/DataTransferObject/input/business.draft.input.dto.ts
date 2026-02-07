/* ======================================================
   DOMAIN || BUSINESS || DRAFT INPUT DTO (CANONICAL)
======================================================

RUOLO:
- DTO canonico per CREAZIONE / UPDATE BusinessDraft
- Usato da:
  - FE (BusinessForm)
  - POST /api/business/create-draft
  - POST /api/business/update-draft

INVARIANTI:
- Dominio = TimeRange (NO stringhe, NO legacy)
- businessDraftId NON richiesto in create
- Backend = source of truth
====================================================== */

import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";
export interface BusinessDraftInputDTO {
   configurationId: string;
 
   businessName: string;
   solutionId: string;
   productId: string;
 
   openingHours: OpeningHoursFE;
 
   contact: {
     mail: string;
     phoneNumber?: string;
     pec?: string;
   };
 
   address?: {
     street?: string;
     number?: string;
     city?: string;
     province?: string;
     zip?: string;
   };
 
   businessDescriptionTags: string[];
   businessServiceTags: string[];
 

 }
 