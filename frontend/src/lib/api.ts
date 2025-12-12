// src/lib/api.ts

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.warn("ATTENZIONE: VITE_API_BASE_URL non definita nel .env");
}

// Wrapper generico
export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API Error ${res.status}: ${msg}`);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}
// COOKIES
export function acceptCookies(visitorId: string, analytics: boolean, marketing: boolean) {
    return apiFetch("/api/cookies/accept", {
      method: "POST",
      body: JSON.stringify({ visitorId, analytics, marketing })
    });
  }
  
  export function getCookieStatus(visitorId: string) {
    return apiFetch(`/api/cookies/status?visitorId=${visitorId}`);
  }
  
  // POLICY
  export function acceptPolicy(userId: string, email: string, policyVersion: string) {
    return apiFetch("/api/policy/accept", {
      method: "POST",
      body: JSON.stringify({ userId, email, policyVersion })
    });
  }
  
  export function getPolicyStatus(userId: string) {
    return apiFetch(`/api/policy/status?userId=${userId}`);
  }
  