    /* ======================================================
    TYPES
    ====================================================== */

    import { type OpeningHoursFE } from "@src/shared/domain/business/openingHours.types";
   

    export type PublicSolutionDTO = {
        id: string;
        name: string;
        description: string; // 🔒 NON opzionale
        imageKey?: string;
        icon?: string;
        industries: string[];
    
    openingHours:OpeningHoursFE;
        
    };

    /* ======================================================
    API RESPONSES
    ====================================================== */

    export type PublicSolutionDetailDTO = {
        id: string;
        name: string;
        description?: string;
        longDescription?: string;
    
        icon?: string;
    
        image?: {
        hero: string;
        card: string;
        fallback?: string;
        };
    
        industries?: string[];
    
        descriptionTags: string[];
        serviceTags: string[];
    
        openingHours: OpeningHoursFE;
    
        /** ⬇️ NUOVO */
        templatePresets?: SolutionTemplatePresetDTO[];
    };

    export type PublicSolutionDetailResponse = {
        ok: true;
        solution: PublicSolutionDetailDTO;
        products?: unknown; 
    };
    export type PublicSolutionsResponse = {
        ok: true;
        solutions: PublicSolutionDTO[];
    };
    

    /* ======================================================
   DTO — SOLUTION (DETAIL)
   → usato da configuratore / pagina solution
====================================================== */
export type SolutionTemplatePresetDTO = {
    id: string;                 // "pizzeria-rustic"
    label: string;              // "Rustico Italiano"
    previewImage: string;       // card image
    gallery: string[];          // immagini preview
    style: "modern" | "elegant" | "minimal" | "bold";
    palette: "warm" | "dark" | "light" | "pastel" | "corporate";
  };
  