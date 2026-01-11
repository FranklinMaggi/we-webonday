// backend/src/domains/cart/cart.dto.ts

export interface CartItemDTO {
    productId: string;
    configurationRequired: boolean;
    configurationId?: string;
    quantity: 1;
  }
  
  export interface CartDTO {
    sessionId: string;
    item?: CartItemDTO[];
    updatedAt: string;
  }
  