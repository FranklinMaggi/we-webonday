/**
 * ======================================================
 * FE || AdminProductUpdatePayload
 * ======================================================
 *
 * RUOLO:
 * - Payload FE → BE per aggiornamento prodotto
 *
 * USATO DA:
 * - adminApi (PUT /api/products/register)
 *
 * ORIGINE:
 * - Mapper / normalizer FE
 *
 * NOTE:
 * - Contiene SOLO i campi accettati dal backend
 * - Nessun campo UI-only
 * ======================================================
 */

export interface AdminUpdateProductDTO {
  id: string;
  name: string;
  nameKey?:string; 
  description: string;
  descriptionKey?:string; 
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";

  startupFee: number;
  pricing: {
    yearly: number;
    monthly: number;
  };




}
