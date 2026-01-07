// FE || dto/AdminUpdateProductDTO.ts
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
