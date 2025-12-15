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
  const res = await fetch(`${API_BASE}/api/policy/version/latest`);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch latest policy (${res.status})`
    );
  }

  return res.json();
}

/* ================================
   FETCH POLICY STATUS
================================ */

export async function fetchPolicyStatus(
  userId: string
): Promise<PolicyStatus> {
  const url = new URL(`${API_BASE}/api/policy/status`);
  url.searchParams.set("userId", userId);

  const res = await fetch(url.toString());

  if (!res.ok) {
    if (res.status === 404) {
      return { accepted: false };
    }
    throw new Error(
      `Failed to fetch policy status (${res.status})`
    );
  }

  return res.json();
}

/* ================================
   ACCEPT POLICY (HARD)
================================ */

export async function acceptPolicyApi(params: {
  userId: string;
  email: string;
  policyVersion: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/policy/accept`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(
      `Failed to accept policy (${res.status}): ${txt}`
    );
  }
}
