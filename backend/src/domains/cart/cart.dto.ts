// backend/src/domains/cart/cart.dto.ts

export interface CartItemDTO {

    configurationId?: string;
  
  }
  
  export interface CartDTO {
    sessionId: string;
    item?: CartItemDTO[];
    updatedAt: string;
  }
  