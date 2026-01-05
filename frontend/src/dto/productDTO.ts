// FE || dto/productDTO.ts
// ======================================================
// PRODUCT DTO — FRONTEND (ALIGNED WITH BACKEND CORE)
// ======================================================

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface ProductPricingDTO {
  yearly: number;
  monthly: number;
}

export type RecurringType = "one_time" | "yearly" | "monthly";

export interface ProductOptionDTO {
  id: string;
  label: string;
  price: number;
  type: RecurringType;
}

export interface ProductDTO {
  id: string;

  name: string;
  nameKey?:string; 
  description: string;
  descriptionKey?:string; 
  status: ProductStatus;

  startupFee: number;
  pricing: ProductPricingDTO;


 

  options: ProductOptionDTO[];
}
