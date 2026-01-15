// routes/auth/google.ts

import type { Env } from "../../../../types/env";
import { getCorsHeaders } from "../../../../index";
import { logActivity } from "../../../activity/router/logActivity";
import { resolveOrCreateUser } from "../../user/auth.user.service";
import { mapGooglePayload } from "@domains/auth/identity/auth.identity.google";
import { buildSessionCookie } from "../../session/auth.session.cookies";
import { getFrontendBaseUrl } from "../helper/frontendBase";


export async function googleAuth(request: Request, env: Env): Promise<Response> {
  const redirect =
    new URL(request.url).searchParams.get("redirect") ?? "/user/dashboard";

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state: redirect, // verrà URL-encoded automaticamente
  });

  const headers = new Headers({
    Location:
      "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString(),
  });

  const cors = getCorsHeaders(request, env);
  for (const [k, v] of Object.entries(cors)) headers.set(k, v);

  return new Response(null, { status: 302, headers });
}

export async function googleCallback(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const rawState = url.searchParams.get("state") ?? "/user/checkout";

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  /**
   * FIX #1 — state va SEMPRE decodificato
   */
  let redirectState = "/";

  try {
    redirectState = decodeURIComponent(rawState);
  } catch {
    redirectState = "/";
  }

  // ===============================
  // TOKEN EXCHANGE
  // ===============================
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

  interface GoogleTokenResponse {
    id_token: string;
    access_token?: string;
    expires_in?: number;
    token_type?: string;
  }

  const tokenJson = (await tokenRes.json()) as GoogleTokenResponse;

  if (!tokenJson.id_token) {
    return new Response("Missing id_token", { status: 500 });
  }

  /**
   * FIX #3 — base64url safe decode
   */
  const base64 = tokenJson.id_token
    .split(".")[1]
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const payload = JSON.parse(atob(base64));

  // ===============================
  // USER RESOLUTION
  // ===============================
  const identity = mapGooglePayload(payload);
  const { userId } = await resolveOrCreateUser(env, identity);

  await logActivity(env, "LOGIN", userId, {
    provider: "google",
    email: identity.email,
  });

  /**
   * FIX #2 — cookie valido per frontend domain
   */
  let cookie = buildSessionCookie(env, userId ,request);


 // 🔐 sicurezza: blocco redirect assoluti
if (redirectState.startsWith("http")) {
  redirectState = "/";
}

const frontendBase = getFrontendBaseUrl(request, env);
const redirectUrl = new URL(redirectState, frontendBase).toString();

return new Response(null, {
  status: 302,
  headers: {
    "Set-Cookie": cookie,
    "Location": redirectUrl,
  },
});

}
