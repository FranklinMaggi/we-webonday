// FE || dto/AdminUpdateProductDTO.ts
export interface AdminUpdateProductDTO {
  id: string;
  name: string;
  description: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";

  startupFee: number;
  pricing: {
    yearly: number;
    monthly: number;
  };

  // 🔑 CORE REQUIRED
  deliveryTime: string;
  flags: string[];

}
