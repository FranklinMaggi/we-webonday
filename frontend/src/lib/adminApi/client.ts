import { API_BASE } from "../config";
import { getAdminToken, adminLogout } from "./auth";

/**
 * Wrapper fetch per tutte le API admin
 */
export async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();

  if (!token) {
    adminLogout();
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token!,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    adminLogout();
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Admin API error");
  }

  return res.json() as Promise<T>;
}
