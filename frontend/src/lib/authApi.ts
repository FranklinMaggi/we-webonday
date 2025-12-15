import { apiFetch } from "./api";
import { API_BASE } from "./config";

export type CurrentUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiFetch("/api/user/me", {
      credentials: "include",
    });
  } catch (err) {
    console.warn("[authApi] getCurrentUser fallback:", err);
    return null;
  }
}

export function getGoogleLoginUrl(redirect?: string): string {
  const url = new URL(`${API_BASE}/api/user/google/auth`);
  if (redirect) url.searchParams.set("redirect", redirect);
  return url.toString();
}
