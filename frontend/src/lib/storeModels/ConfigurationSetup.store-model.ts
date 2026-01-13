/**
 * ======================================================
 * FE || ConfigurationSetupStoreModel
 * ======================================================
 *
 * RUOLO:
 * - Stato FE del wizard di configurazione
 *
 * USATO DA:
 * - Zustand store
 * - Flusso checkout / setup ordine
 *
 * NOTE:
 * - Stato SOLO frontend
 * - Non rappresenta il dominio backend
 * ======================================================
 */

export type UserConfigurationSetupDTO = {
   /* =========================
      BUSINESS
   ========================= */
   businessName: string;
   sector: string;
 
   address: string;
   city: string;
   state: string;
   zip: string;
 
   businessImage?: File | null;
   placeId?: string;
 
   /* =========================
      CONTACT
   ========================= */
   email: string;
   phone?: string;
   privacyAccepted: boolean;
 
   /* =========================
      COMMERCIAL CONTEXT
      (from cart / solution)
   ========================= */
   solutionId: string;
   productId: string;
   optionIds: string[];
 
/* =========================
   TAGS (FROM SOLUTION)
   FE-ONLY
========================= */
   solutionDescriptionTags: string[];
   solutionServiceTags: string[];

/* =========================
   TAGS (SELECTED BY BUSINESS)
========================= */
   businessDescriptionTags: string[];
   businessServiceTags: string[];

 
   /* =========================
      OPENING HOURS
   ========================= */
   openingHours?: {
     monday?: string;
     tuesday?: string;
     wednesday?: string;
     thursday?: string;
     friday?: string;
     saturday?: string;
     sunday?: string;
   };
 
   /* =========================
      VISIBILITY (DERIVED)
   ========================= */
   visibility: {
     contactForm: boolean;
     address: boolean;
     gallery: boolean;
     openingHours: boolean;
   };
 
   /* =========================
      DESIGN (SEMANTICO)
   ========================= */
   colorPreset?: string;
   style?: "modern" | "elegant" | "minimal" | "bold";
 
   /* =========================
      CONTENT (TESTUALE)
   ========================= */
   description?: string;
   services?: string;
   cta?: string;
 
   /* =========================
      EXTRAS
   ========================= */
   extras?: {
     maps: boolean;
     whatsapp: boolean;
     newsletter: boolean;
   };
 };
 