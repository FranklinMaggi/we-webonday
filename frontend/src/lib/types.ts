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
  
  // Alias, se ti serve un tipo "Product" lato frontend
  export type Product = ProductDTO;
  