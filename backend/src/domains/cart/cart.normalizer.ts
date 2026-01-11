// backend/src/domains/cart/cart.normalizer.ts

export function normalizeCartInput(raw: any) {
    return {
      sessionId: String(raw?.sessionId ?? ""),
      items: Array.isArray(raw?.items) ? raw.items : [],
      updatedAt: raw?.updatedAt,
    };
  }
  