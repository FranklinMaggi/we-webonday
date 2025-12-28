export type RecurringType = "one_time" | "yearly" | "monthly";

export interface ProductOptionDTO {
  id: string;
  label: string;
  price: number;
  recurringType: RecurringType;
}

export interface ProductPricingDTO {
  yearly: number;
  monthly: number;
}

export interface ProductDTO {
  id: string;
  title: string;
  description: string;
  startupFee: number;
  pricing: ProductPricingDTO;
  deliveryTime: string;
  flags: string[];
  options: ProductOptionDTO[];
}
