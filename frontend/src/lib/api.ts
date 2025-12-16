// src/lib/api.ts
import { API_BASE } from "./config";

if (API_BASE === undefined) {
  console.warn("ATTENZIONE: API_BASE non definita");
}

/* =========================
   API FETCH WRAPPER
========================= */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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

/* =========================
   COOKIES (NO visitorId)
========================= */
export function acceptCookies(
  analytics: boolean,
  marketing: boolean
) {
  return apiFetch("/cookies/accept", {
    method: "POST",
    body: JSON.stringify({ analytics, marketing }),
  });
}

export function getCookieStatus() {
  return apiFetch("/cookies/status");
}

/* =========================
   POLICY (USER)
========================= */
export function acceptPolicy(
  userId: string,
  email: string,
  policyVersion: string
) {
  return apiFetch("/policy/accept", {
    method: "POST",
    body: JSON.stringify({ userId, email, policyVersion }),
  });
}

export function getPolicyStatus(userId: string) {
  return apiFetch(`/policy/status?userId=${userId}`);
}
