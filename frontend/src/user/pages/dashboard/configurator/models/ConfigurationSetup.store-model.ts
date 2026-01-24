/**
 * ======================================================
 * FE || ConfigurationSetupStoreDTO (CANONICAL)
 * ======================================================
 *
 * RUOLO:
 * - Stato FE completo del configurator
 * - Workspace temporaneo
 *
 * SOURCE OF TRUTH:
 * - Backend per id / solutionId / productId / optionIds
 * - FE per il resto
 * ======================================================
 */

export type ConfigurationSetupStoreDTO = {
   /* =========================
      CORE (BE)
   ========================= */
   configurationId?: string;
 
   solutionId: string;
   productId: string;
   optionIds: string[];
 
   /* =========================
      BUSINESS
   ========================= */
   businessName: string;
   sector: string;
 
   email: string;
   phone?: string;
 
   address?: string;
   city?: string;
   state?: string;
   zip?: string;
 
   openingHours?: Record<string, string>;
 
   services?: string;
   description?: string;
 
   /* =========================
      TAGS
   ========================= */
   solutionServiceTags: string[];
   businessServiceTags: string[];
   businessDescriptionTags: string[];
 
   /* =========================
      DESIGN
   ========================= */
   layoutId?: string;
   style?: string;
   colorPreset?: string;
 
   visibility?: Record<string, boolean>;
 
   /* =========================
      META
   ========================= */
   privacyAccepted: boolean;
 };
 