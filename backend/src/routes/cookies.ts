// src/routes/cookies.ts
import type { Env } from "../types/env";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    },
  });
}

type CookieConsentPayload = {
  visitorId: string;
  analytics: boolean;
  marketing: boolean;
};

type StoredCookieConsent = {
  visitorId: string;
  analytics: boolean;
  marketing: boolean;
  necessary: boolean;
  version: string;
  updatedAt: string;
};

export async function acceptCookies(request: Request, env: Env): Promise<Response> {
  let payload: CookieConsentPayload;

  try {
    payload = (await request.json()) as CookieConsentPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (!payload.visitorId || typeof payload.visitorId !== "string") {
    return jsonResponse({ error: "Missing or invalid visitorId" }, 400);
  }

  const consent: StoredCookieConsent = {
    visitorId: payload.visitorId,
    analytics: Boolean(payload.analytics),
    marketing: Boolean(payload.marketing),
    necessary: true,
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
  };

  const key = `cookie-consent:${payload.visitorId}`;
  await env.COOKIES_KV.put(key, JSON.stringify(consent));

  return jsonResponse({ ok: true });
}

export async function getCookieStatus(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const visitorId = url.searchParams.get("visitorId");

  if (!visitorId) {
    return jsonResponse({ error: "Missing visitorId" }, 400);
  }

  const key = `cookie-consent:${visitorId}`;
  const stored = await env.COOKIES_KV.get(key);

  if (!stored) {
    return jsonResponse({ exists: false });
  }

  return jsonResponse({
    exists: true,
    consent: JSON.parse(stored) as StoredCookieConsent,
  });
}
