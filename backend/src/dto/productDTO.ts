// DTO ufficiali condivisi con il frontend

export interface ProductOptionDTO {
    id: string;
    label: string;
    price: number;
    recurring: boolean;
  }
  
  export interface ProductDTO {
    id: string;
    title: string;
    description: string;
    basePrice: number;
    deliveryTime: string;
    flags: string[];
    options: ProductOptionDTO[];
  }
  