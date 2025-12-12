import type { Env } from "../types/env";

export async function googleAuth(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect") ?? "/user/checkout";

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: redirect, // qui può essere path o URL assoluta (localhost, webonday, ecc.)
  });

  return Response.redirect(
    "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString(),
    302
  );
}

export async function googleCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirectState = url.searchParams.get("state") ?? "/user/checkout";

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

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

  const tokenJson = (await tokenRes.json()) as { id_token: string };
  const payload = JSON.parse(atob(tokenJson.id_token.split(".")[1]));

  const email = payload.email as string;
  const googleId = payload.sub as string;

  // Cerca utente esistente nei tuoi archivi ON_USERS_KV
  let userId = await env.ON_USERS_KV.get(`google_${googleId}`);

  if (!userId) {
    userId = crypto.randomUUID();

    const userObj = {
      id: userId,
      email,
      googleId,
      createdAt: new Date().toISOString(),
    };

    await env.ON_USERS_KV.put(`user_${userId}`, JSON.stringify(userObj));
    await env.ON_USERS_KV.put(`google_${googleId}`, userId);
  }

  // ===========================
  // COSTRUZIONE REDIRECT FINALE
  // ===========================

  // Origin consentite (adatta queste stringhe alla tua config reale)
  const allowedOrigins = [
    env.FRONTEND_URL,              // es. https://webonday.it
    "http://localhost:5173",       // dev locale
    "https://payment.webonday.it", // futuro sottodominio pagamenti
  ];

  let finalRedirect: string;

  try {
    // Se redirectState è una URL assoluta, new URL funziona.
    const maybeUrl = new URL(redirectState);

    const originAllowed = allowedOrigins.some(
      (origin) => maybeUrl.origin === origin
    );

    if (originAllowed) {
      // OK: redirect completo come richiesto (es. http://localhost:5173/user/checkout)
      finalRedirect = maybeUrl.toString();
    } else {
      // Origin non ammessa: fall back a checkout sul FRONTEND_URL
      finalRedirect = env.FRONTEND_URL + "/user/checkout";
    }
  } catch {
    // redirectState NON è una URL assoluta → lo tratto come path
    finalRedirect = env.FRONTEND_URL + redirectState;
  }

  // Aggiungo userId alla query string, così il frontend può sincronizzarsi
  const redirectUrl = new URL(finalRedirect);
  redirectUrl.searchParams.set("userId", userId);
  const isLocal = env.FRONTEND_URL.startsWith("http://localhost");

  const cookie = [
    `webonday_session=${userId}`,
    "HttpOnly",
    "Path=/",
    "Max-Age=2592000",
    !isLocal && "Secure",
    "SameSite=None",
  ].filter(Boolean).join("; ");
  
  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": cookie,
      "Location": redirectUrl.toString(),
    },
  });
}

export async function getCurrentUser(request: Request, env: Env): Promise<Response> {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(/webonday_session=([^;]+)/);

  if (!match) {
    return new Response(
      JSON.stringify({ ok: true, user: null }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const userId = match[1];
  const raw = await env.ON_USERS_KV.get(`user_${userId}`);

  return new Response(
    JSON.stringify({
      ok: true,
      user: raw ? JSON.parse(raw) : null,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
