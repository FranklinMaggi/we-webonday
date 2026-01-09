/**
 * ======================================================
 * FE || DTO — USER CONFIGURATION SETUP
 * ======================================================
 *
 * RUOLO:
 * - Contratto dati PRE-ORDER per configurazione progetto
 *
 * USATO DA:
 * - Zustand store (UI)
 * - userApi (order.setup)
 *
 * NOTE ARCHITETTURALI:
 * - SOLO riferimenti semantici
 * - Nessun dettaglio di rendering (colori raw, CSS)
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
      (from cart)
   ========================= */
   solutionId: string;
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
 