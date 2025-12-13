// src/lib/ordersApi.ts
const API_BASE = import.meta.env.VITE_API_URL;

export type CreateOrderPayload = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  billingAddress?: string;
  piva?: string;
  businessName?: string;
  items: any[];
  total: number;
};

export async function createOrder(
  payload: CreateOrderPayload
): Promise<{ orderId: string }> {
  const res = await fetch(`${API_BASE}/api/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Errore creazione ordine");
  }

  return res.json();
}
