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

  /* ===== USER LOOKUP / CREATE ===== */
  let userId = await env.ON_USERS_KV.get(`google_${googleId}`);

  if (!userId) {
    userId = crypto.randomUUID();

    await env.ON_USERS_KV.put(
      `user_${userId}`,
      JSON.stringify({
        id: userId,
        email,
        googleId,
        createdAt: new Date().toISOString(),
      })
    );

    await env.ON_USERS_KV.put(`google_${googleId}`, userId);
  }

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
  redirectUrl.searchParams.set("email", email);

  /* ===== SESSION COOKIE ===== */
  const isLocal = env.FRONTEND_URL.startsWith("http://localhost");

  const cookieParts = [
    `webonday_session=${userId}`,
    "Path=/",
    "HttpOnly",
    "Max-Age=2592000",
    `Domain=${new URL(env.FRONTEND_URL).hostname}`,
  ];
  

  if (isLocal) {
    cookieParts.push("SameSite=Lax");
  } else {
    cookieParts.push("SameSite=None");
    cookieParts.push("Secure");
  }

  const headers = new Headers({
    "Set-Cookie": cookieParts.join("; "),
    Location: redirectUrl.toString(),
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

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const cors = getCorsHeaders(request, env);
  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }

  return new Response(
    JSON.stringify({ ok: true, user }),
    { headers }
  );
}

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
