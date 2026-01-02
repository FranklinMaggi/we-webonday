// FE || dto/AdminProductDTO.ts
export interface AdminProductDTO {
    id: string;
    name: string;
    description: string;
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
    startupFee: number;
    pricing: {
      yearly: number;
      monthly: number;
    };
   optionIds : string[];
    flags: string[];
    deliveryTime: string;
 
  }
  export 
  interface AdminOptionDTO {
    id: string;
    name: string;
    description : string; 
    price: number;
    payment: {
      mode: "one_time" | "recurring";
      interval?: "monthly" | "yearly";
    };
    status: "ACTIVE" | "ARCHIVED";
  }
  