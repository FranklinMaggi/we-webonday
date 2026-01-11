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
   businessTags: string[];
   /* =========================
      COMMERCIAL CONTEXT
      (from cart)
   ========================= */
   solutionId: string;
   solutionTags: string[];
   productId: string;
   optionIds: string[];
   openingHours?: {
      monday?: string;
      tuesday?: string;
      wednesday?: string;
      thursday?: string;
      friday?: string;
      saturday?: string;
      sunday?: string;
    };
    
    visibility: {
      contactForm: boolean;
      address: boolean;
      gallery: boolean;
      openingHours: boolean;
       businessTags?: string[];
    };
   /* =========================
      DESIGN (SEMANTICO)
   ========================= */
   colorPreset?: string; // es. "modern_blue"
   style?: "modern" | "elegant" | "minimal" | "bold";
 
   /* =========================
      CONTENT
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
 