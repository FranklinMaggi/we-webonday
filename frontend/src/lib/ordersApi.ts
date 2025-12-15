// src/lib/ordersApi.ts
import { API_BASE } from "./config";

export type CreateOrderPayload = {
  email: string;
  items: any[];
  total: number;

  // 🔒 OBBLIGATORIO
  policyVersion: string;
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
