// backend/src/routes/userGoogle.ts
import type { Env } from "../types/env";
import { getCorsHeaders } from "../index";

/* ============================
   GOOGLE AUTH
============================ */
export async function googleAuth(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect") ?? "/user/checkout";

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state: redirect,
  });

  const headers = new Headers({
    Location:
      "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString(),
  });

  const cors = getCorsHeaders(request, env);
  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }

  return new Response(null, {
    status: 302,
    headers,
  });
}

/* ============================
   GOOGLE CALLBACK
============================ */
export async function googleCallback(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirectState = url.searchParams.get("state") ?? "/user/checkout";

  if (!code) {
    return json({ ok: false, error: "Missing code" }, request, env, 400);
  }

  /* ===== TOKEN EXCHANGE ===== */
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    }),
  });

  if (!tokenRes.ok) {
    console.error("Google token error:", await tokenRes.text());
    return json({ ok: false, error: "Google token error" }, request, env, 500);
  }

  const tokenJson = (await tokenRes.json()) as { id_token?: string };

  if (!tokenJson.id_token) {
    return json({ ok: false, error: "Missing id_token" }, request, env, 500);
  }

  /* ===== DECODE JWT ===== */
  const payload = JSON.parse(atob(tokenJson.id_token.split(".")[1]));
  const email = payload.email as string;
  const googleId = payload.sub as string;

/* ===== USER LOOKUP / UPSERT ===== */
let userId = await env.ON_USERS_KV.get(`google_${googleId}`);

const userRecord = {
  // chiave stabile
  id: userId ?? crypto.randomUUID(),
  // identità
  googleId,
  email,
  emailVerified: Boolean(payload.email_verified),
  // profilo base
  name: (payload.name as string) ?? null,
  givenName: (payload.given_name as string) ?? null,
  familyName: (payload.family_name as string) ?? null,
  picture: (payload.picture as string) ?? null,
  locale: (payload.locale as string) ?? null,
  // metadata
  lastLoginAt: new Date().toISOString(),
};

// se nuovo utente: set createdAt
if (!userId) {
  (userRecord as any).createdAt = userRecord.lastLoginAt;
}

// merge con eventuale record esistente (mantieni createdAt)
if (userId) {
  const prevRaw = await env.ON_USERS_KV.get(`user_${userId}`);
  if (prevRaw) {
    const prev = JSON.parse(prevRaw);
    (userRecord as any).createdAt = prev.createdAt ?? userRecord.lastLoginAt;
  }
}

// salva record e indici secondari
await env.ON_USERS_KV.put(`user_${userRecord.id}`, JSON.stringify(userRecord));
await env.ON_USERS_KV.put(`EMAIL:${email.toLowerCase()}`, userRecord.id);
await env.ON_USERS_KV.put(`google_${googleId}`, userRecord.id);

userId = userRecord.id;

  /* ===== SAFE REDIRECT ===== */
  let finalRedirect = env.FRONTEND_URL + "/user/checkout";

  try {
    const u = new URL(redirectState);
    if ([env.FRONTEND_URL, "http://localhost:5173"].includes(u.origin)) {
      finalRedirect = u.toString();
    }
  } catch {
    finalRedirect = env.FRONTEND_URL + redirectState;
  }

  const redirectUrl = new URL(finalRedirect);

// ===========================
// COOKIE SESSIONE
// ===========================
const isLocal = env.FRONTEND_URL.startsWith("http://localhost");

// In locale: SameSite=Lax (niente Secure), in produzione: SameSite=None; Secure
const cookieParts = [
  `webonday_session=${userId}`,
  "Path=/",
  "HttpOnly",
  "Max-Age=2592000",
  isLocal ? "SameSite=Lax" : "SameSite=None",
];

if (!isLocal) {
  cookieParts.push("Secure");
}

const cookieHeader = cookieParts.join("; ");

return new Response(null, {
  status: 302,
  headers: {
    "Set-Cookie": cookieHeader,
    "Location": redirectUrl.toString(),
  },
});}

/* ============================
   GET CURRENT USER
============================ */
export async function getCurrentUser(
    request: Request,
    env: Env
  ): Promise<Response> {
    const cookie = request.headers.get("Cookie") ?? "";
    const match = cookie.match(/webonday_session=([^;]+)/);
  
    let user = null;
  
    if (match) {
      const raw = await env.ON_USERS_KV.get(`user_${match[1]}`);
      if (raw) user = JSON.parse(raw);
    }
  
    return new Response(JSON.stringify({ ok: true, user }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  
  await logLogin(env, {
    userId: user.id,
    email: user.email,
    provider: "google",
    ip: request.headers.get("CF-Connecting-IP"),
    userAgent: request.headers.get("User-Agent"),
  });
  
/* ============================
   JSON HELPER
============================ */
function json(
  body: unknown,
  request: Request,
  env: Env,
  status = 200
): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const cors = getCorsHeaders(request, env);
  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}
