// backend/src/routes/policy.ts
import type { Env } from "../types/env";
import { z } from "zod";

/* =========================
   HELPERS
========================= */

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* =========================
   SCHEMAS
========================= */

const RegisterPolicySchema = z.object({
  version: z.string().min(1),
  content: z.string().min(1),
});

const AcceptPolicySchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  policyVersion: z.string().min(1),
});

/* =========================
   REGISTER POLICY VERSION (ADMIN)
========================= */

export async function registerPolicyVersion(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = RegisterPolicySchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "Invalid body" }, 400);
  }

  const { version, content } = body;

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content)
  );
  const hash = [...new Uint8Array(hashBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const record = {
    version,
    content,
    hash,
    timestamp: new Date().toISOString(),
  };

  await env.POLICY_KV.put(
    `POLICY_VERSION:${version}`,
    JSON.stringify(record)
  );
  await env.POLICY_KV.put("POLICY_LATEST", version);

  return json({ ok: true, version, hash });
}

/* =========================
   GET LATEST POLICY
========================= */

export async function getLatestPolicy(env: Env): Promise<Response> {
  const latest = await env.POLICY_KV.get("POLICY_LATEST");
  if (!latest) {
    return json({ ok: true, hasPolicy: false, policy: null });
  }

  const data = await env.POLICY_KV.get(`POLICY_VERSION:${latest}`);
  if (!data) {
    return json({ ok: false, error: "Latest policy missing" }, 500);
  }

  return new Response(data, {
    headers: { "Content-Type": "application/json" },
  });
}

/* =========================
   GET POLICY BY VERSION
========================= */

export async function getPolicyVersion(
  request: Request,
  env: Env
): Promise<Response> {
  const version = new URL(request.url).searchParams.get("version");
  if (!version) return json({ error: "Missing version" }, 400);

  const data = await env.POLICY_KV.get(`POLICY_VERSION:${version}`);
  if (!data) return json({ error: "Not found" }, 404);

  return new Response(data, {
    headers: { "Content-Type": "application/json" },
  });
}

/* =========================
   LIST POLICY VERSIONS
========================= */

export async function listPolicyVersions(env: Env): Promise<Response> {
  const list = await env.POLICY_KV.list({ prefix: "POLICY_VERSION:" });
  const versions = list.keys.map((k) =>
    k.name.replace("POLICY_VERSION:", "")
  );
  return json({ ok: true, versions });
}

/* =========================
   ACCEPT POLICY (USER)
========================= */

export async function acceptPolicy(
  request: Request,
  env: Env
): Promise<Response> {
  let body;
  try {
    body = AcceptPolicySchema.parse(await request.json());
  } catch {
    return json({ ok: false, error: "Invalid input" }, 400);
  }

  const { userId, email, policyVersion } = body;

  const latest = await env.POLICY_KV.get("POLICY_LATEST");
  if (!latest) {
    return json({ ok: false, error: "No policy available" }, 500);
  }

  if (policyVersion !== latest) {
    return json({ ok: false, error: "POLICY_OUTDATED" }, 409);
  }

  await env.POLICY_KV.put(
    `POLICY_ACCEPTANCE:${userId}:${policyVersion}`,
    JSON.stringify({
      email,
      acceptedAt: new Date().toISOString(),
    })
  );

  return json({ ok: true });
}

/* =========================
   GET POLICY STATUS
========================= */

export async function getPolicyStatus(
  request: Request,
  env: Env
): Promise<Response> {
  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId) return json({ error: "Missing userId" }, 400);

  const latest = await env.POLICY_KV.get("POLICY_LATEST");
  if (!latest) return json({ accepted: false });

  const key = `POLICY_ACCEPTANCE:${userId}:${latest}`;
  const stored = await env.POLICY_KV.get(key);

  if (!stored) {
    return json({ accepted: false, policyVersion: latest });
  }

  return json({
    accepted: true,
    policyVersion: latest,
    ...JSON.parse(stored),
  });
}
