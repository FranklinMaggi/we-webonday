// src/lib/policyApi.ts

// src/lib/policyApi.ts
const API_BASE = import.meta.env.VITE_API_URL;

export async function getLatestPolicyVersion(): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE}/api/policy/version/latest`);
  if (!res.ok) throw new Error("Errore fetch policy");
  return res.json();
}

export async function acceptPolicy(policyVersionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/policy/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ policyVersionId }),
  });

  if (!res.ok) throw new Error("Errore accept policy");
}

if (!API_BASE || !API_BASE.startsWith("https://")) {
  console.error("[PolicyAPI] ERRORE: VITE_API_URL non valida:", API_BASE);
}

export type PolicyVersion = {
  version: string;
  content: string;
  hash: string;
  timestamp: string;
};

export type PolicyStatus = {
  accepted: boolean;
  policyVersion?: string;
  acceptedAt?: string;
};

// ================================
// FETCH LATEST POLICY
// ================================
export async function fetchLatestPolicy(): Promise<PolicyVersion> {
  const url = `${API_BASE}/api/policy/version/latest`;
  console.log("[PolicyAPI] Fetch latest policy:", url);

  let res: Response;

  try {
    res = await fetch(url, { method: "GET" });
  } catch (err) {
    console.error("[PolicyAPI] NETWORK ERROR:", err);
    throw new Error("Network error fetching latest policy");
  }

  if (!res.ok) {
    console.error("[PolicyAPI] ERRORE FETCH LATEST:", res.status);
    throw new Error(`Failed to fetch latest policy (${res.status})`);
  }

  return res.json();
}

// ================================
// FETCH POLICY STATUS
// ================================
export async function fetchPolicyStatus(userId: string): Promise<PolicyStatus> {
  const url = new URL(`${API_BASE}/api/policy/status`);
  url.searchParams.set("userId", userId);

  console.log("[PolicyAPI] Fetch policy status:", url.toString());

  const res = await fetch(url.toString());

  if (!res.ok) {
    if (res.status === 404) {
      return { accepted: false };
    }
    console.error("[PolicyAPI] ERRORE FETCH STATUS:", res.status);
    throw new Error(`Failed to fetch policy status (${res.status})`);
  }

  return res.json();
}

// ================================
// ACCEPT POLICY
// ================================
export async function acceptPolicyApi(params: {
  userId: string;
  email?: string;
  policyVersion: string;
}) {
  const url = `${API_BASE}/api/policy/accept`;

  console.log("[PolicyAPI] Accept policy:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: params.userId,
      email: params.email ?? "visitor@webonday.local",
      policyVersion: params.policyVersion,
    }),
  });

  if (!res.ok) {
    console.error("[PolicyAPI] ERRORE ACCEPT:", res.status);
    throw new Error(`Errore accept policy: ${res.status}`);
  }

  return res.json();
}
