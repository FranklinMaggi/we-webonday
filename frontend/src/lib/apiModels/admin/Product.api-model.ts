/**
 * ======================================================
 * FE || AdminProductApiModel
 * ======================================================
 *
 * RUOLO:
 * - Shape dati PRODOTTO in contesto ADMIN
 *
 * USATO DA:
 * - adminApi (read)
 * - editor admin (via normalizer)
 *
 * ORIGINE:
 * - Backend CORE (source of truth)
 *
 * NOTE:
 * - Questo NON è un modello UI
 * - Rappresenta fedelmente il dominio backend
 * ======================================================
 */

export interface AdminProductApiModel {
    id: string;
    name: string;
    nameKey?:string; 
    description: string;
    descriptionKey?:string ; 
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
    startupFee: number;
    pricing: {
      yearly: number;
      monthly: number;
    };
   optionIds : string[];
    

 
  }
 
  