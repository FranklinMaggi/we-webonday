// ======================================================
// BE || DTO || BusinessDraftBaseReadDTO (READ)
// ======================================================
//
// RUOLO:
// - DTO READ per BusinessDraft
// - Usato per:
//   • Prefill Step Business (FE)
//   • Sync stato BE → FE
//
// SOURCE OF TRUTH:
// - BusinessDraftSchema (DOMAIN)
// ======================================================

import { OpeningHoursFE } from "@domains/GeneralSchema/hours.opening.schema";


export type BusinessDraftBaseReadDTO = {
   businessDraftId: string;
 
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
     country?: string;
   };
 
   businessDescriptionTags: string[];
   businessServiceTags: string[];
   verification: "DRAFT"|"PENDING" | "ACCEPTED" | "REJECTED";      
   /** 🔑 SOURCE OF TRUTH */
   businessDataComplete: boolean;
 };