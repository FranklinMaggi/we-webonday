// backend/src/domains/cart/cart.keys.ts

export const CART_KEY = (sessionId: string) =>
    `CART:${sessionId}`;
  