// backend/src/routes/policy.ts
import type { Env } from "../types/env";
interface PolicyAcceptBody {
  userId: string;
  email: string;
  policyVersion: string;
}


function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    },
  });
}

export async function acceptPolicy(request: Request, env: Env): Promise<Response> {
  let body: PolicyAcceptBody;

  try {
    body = (await request.json()) as PolicyAcceptBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const { userId, email, policyVersion } = body;

  if (!userId || !email || !policyVersion) {
    return jsonResponse({ error: "Missing fields" }, 400);
  }

  const data = {
    email,
    policyVersion,
    acceptedAt: new Date().toISOString(),
  };

  await env.POLICY_KV.put(`ACCEPT:${userId}`, JSON.stringify(data));

  return jsonResponse({ ok: true, data }, 200);
}

export async function getPolicyStatus(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return jsonResponse({ error: "Missing userId" }, 400);
  }

  const stored = await env.POLICY_KV.get(`ACCEPT:${userId}`);

  if (!stored) {
    return jsonResponse({ accepted: false }, 200);
  }

  return jsonResponse(
    {
      accepted: true,
      ...JSON.parse(stored),
    },
    200
  );
}
