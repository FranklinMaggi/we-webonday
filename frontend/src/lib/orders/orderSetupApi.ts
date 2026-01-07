import { API_BASE } from "../config";
import type { ConfigurationSetupData } from "../../pages/user/configurator/setup/configurationSetup.store";
export async function saveOrderSetup(
  orderId: string,
  data: ConfigurationSetupData
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
