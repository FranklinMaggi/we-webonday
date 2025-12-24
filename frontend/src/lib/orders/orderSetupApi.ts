import { API_BASE } from "../config";
import type { OrderSetupData } from "../../pages/user/business/setup/orderSetup.store";
export async function saveOrderSetup(
  orderId: string,
  data: OrderSetupData
) {
  const res = await fetch(
    `${API_BASE}/api/order/setup?orderId=${orderId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt);
  }

  return res.json();
}
