import { API_BASE } from "./config";

/* ================================
   TYPES
================================ */

export type PolicyVersion = {
  version: string;
  content: string;
  hash: string;
};

export type PolicyStatus = {
  accepted: boolean;
  policyVersion?: string;
  acceptedAt?: string;
};

/* ================================
   FETCH LATEST POLICY
================================ */

export async function fetchLatestPolicy(): Promise<PolicyVersion> {
  const res = await fetch(`${API_BASE}/api/policy/version/latest`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch latest policy");
  }

  return res.json();
}

/* ================================
   FETCH POLICY STATUS (SESSION)
================================ */

export async function getPolicyStatus(): Promise<PolicyStatus> {
  const res = await fetch(`${API_BASE}/api/policy/status`, {
    credentials: "include",
  });

  if (!res.ok) {
    return { accepted: false };
  }

  return res.json();
}

/* ================================
   ACCEPT POLICY (SESSION)
================================ */

export async function acceptPolicy(policyVersion: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/policy/accept`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ policyVersion }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Policy accept failed: ${txt}`);
  }
}
