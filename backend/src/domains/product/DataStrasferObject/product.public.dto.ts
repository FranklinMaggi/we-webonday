/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || PRODUCT || PUBLIC DTO
======================================================

RUOLO:
- Contratto API pubblico per Product
- Usato dal frontend

NOTE:
- options è JOIN applicativo
- NON rappresenta lo stato di dominio

MODIFICHE:
- Ogni modifica richiede audit FE
====================================================== */

export type RecurringType = "one_time" | "yearly" | "monthly";

export interface ProductOptionPublicDTO {
  id: string;
  label: string;
  price: number;
  description?:string; 
  type: RecurringType;
}

export interface ProductPublicDTO {
  id: string;
  label: string;
  description: string;
  nameKey?: string;
  descriptionKey?: string;
  startupFee: number;
  pricing: {
    yearly: number;
    monthly: number;
    requiresConfiguration: boolean;
  };
  options: ProductOptionPublicDTO[];
  
}
