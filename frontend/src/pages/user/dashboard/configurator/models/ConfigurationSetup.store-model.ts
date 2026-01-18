/**
 * ======================================================
 * FE || UserConfigurationSetupDTO (WIZARD REAL)
 * ======================================================
 *
 * RUOLO:
 * - Stato FE del wizard di configurazione
 *
 * SOURCE OF TRUTH:
 * - Backend per solutionId + optionIds
 * - FE per il resto (temporaneo)
 *
 * NOTE:
 * - Solo campi realmente usati dagli step attivi
 * ======================================================
 */

export type UserConfigurationSetupDTO = {
   /* =========================
      STEP 1 — SOLUTION
   ========================= */
   solutionId: string;
   optionIds: string[];
 
   /* =========================
      STEP 2 — BUSINESS INFO
   ========================= */
   businessName: string;
   sector: string;
 
   email: string;
   phone?: string;
   privacyAccepted: boolean;
 
   /* =========================
      STEP 3 — TAGS
   ========================= */
   solutionServiceTags: string[];
   businessServiceTags: string[];
   businessDescriptionTags: string[];
 };
 