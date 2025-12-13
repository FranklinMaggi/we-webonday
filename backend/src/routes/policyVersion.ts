import type { Env } from "../types/env";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    },
  });
}


export async function registerPolicyVersion(request: Request, env: Env) {
    type PolicyVersionBody = {
        version: string;
        content: string;
      };
      
      const rawBody = await request.json() as PolicyVersionBody;
      


  if (!rawBody || typeof rawBody.version !== "string" || typeof rawBody.content !== "string") {
    return json({ ok: false, error: "Invalid body" }, 400);
  }

  const { version, content } = rawBody;

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content)
  );
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const data = {
    version,
    content,
    hash,
    timestamp: new Date().toISOString(),
  };

  await env.POLICY_KV.put(`POLICY_VERSION:${version}`, JSON.stringify(data));
  await env.POLICY_KV.put("POLICY_LATEST", version);

  return json({ ok: true, version, hash });
}

export async function getLatestPolicy(env: Env) {
  const version = await env.POLICY_KV.get("POLICY_LATEST");
  if (!version) {
    return json({
      ok: true,
      hasPolicy: false,
      policy: null,
      message: "No policy registered yet"
    });
  }
  const data = await env.POLICY_KV.get(`POLICY_VERSION:${version}`);
  if (!data) {
    return json({
      ok: false,
      hasPolicy: false,
      message: "Latest policy version not found"
    });
  }
  
  return new Response(data, {
    headers: {
      "Content-Type": "application/json"
     
    },
  });
}

export async function getPolicyVersion(request: Request, env: Env) {
  const url = new URL(request.url);
  const version = url.searchParams.get("version");
  if (!version) return json({ error: "Missing version" }, 400);

  const data = await env.POLICY_KV.get(`POLICY_VERSION:${version}`);
  if (!data) return json({ error: "Version not found" }, 404);

  return new Response(data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function listPolicyVersions(env: Env) {
  const list = await env.POLICY_KV.list({ prefix: "POLICY_VERSION:" });
  const versions = list.keys.map((k) => k.name.replace("POLICY_VERSION:", ""));
  return json(versions);
}
