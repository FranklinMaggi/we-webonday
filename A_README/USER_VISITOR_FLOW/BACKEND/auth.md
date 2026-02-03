francescomaggi@MacBook-Pro We-WebOnDay % cd '/Users/francescomaggi/Documents/GitHub/W
e-WebOnDay/backend/src/domains/auth'
francescomaggi@MacBook-Pro auth % aidump
AI_DUMP_V1
ROOT: /Users/francescomaggi/Documents/GitHub/We-WebOnDay/backend/src/domains/auth
DATE: 2026-01-31T11:05:27Z
INCLUDE_EXT: js,ts,css,tsx,html,json,toml
EXCLUDE_DIRS: .wrangler,node_modules,dist,build,coverage,.next,.cache,.git,frontend/public

=== FILE: cookies/cookies.ts
LANG: ts
SIZE:     2359 bytes
----------------------------------------
/**
 * AI-SUPERCOMMENT — COOKIE CONSENT (AGGREGATED)
 *
 * RUOLO:
 * - Raccogliere statistiche aggregate sul consenso cookie
 *
 * COSA FA:
 * - NON crea cookie
 * - NON associa consenso a visitorId
 * - NON influenza autenticazione o sessione
 *
 * PERCHÉ:
 * - GDPR: consenso solo informativo
 * - Nessun profiling utente
 * - Nessun tracciamento individuale
 *
 * STORAGE:
 * - KV aggregata per giorno (COOKIE_STATS:YYYY-MM-DD)
 *
 * NOTA CRITICA:
 * - Questo endpoint NON deve mai bloccare il flusso utente
 */

import type { Env } from "../../../types/env";

/* =========================
   DOMAIN JSON HELPER
   (NO CORS, NO SIDE EFFECT)
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/* =========================
   TYPES
========================= */
type CookieEventPayload = {
  analytics: boolean;
  marketing: boolean;
};

/* =========================
   POST /api/cookies/accept
   → LOG AGGREGATO
========================= */
export async function acceptCookies(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  }

  let payload: CookieEventPayload;
  try {
    payload = (await request.json()) as CookieEventPayload;
  } catch {
    return json({ error: "INVALID_JSON_BODY" }, 400);
  }

  const today = new Date().toISOString().slice(0, 10);
  const key = `COOKIE_STATS:${today}`;

  const raw = await env.COOKIES_KV.get(key);
  const stats = raw
    ? JSON.parse(raw)
    : {
        accepted: 0,
        rejected: 0,
        analyticsOn: 0,
        marketingOn: 0,
      };

  // evento: accettazione / rifiuto
  if (payload.analytics || payload.marketing) {
    stats.accepted++;
  } else {
    stats.rejected++;
  }

  if (payload.analytics) stats.analyticsOn++;
  if (payload.marketing) stats.marketingOn++;

  await env.COOKIES_KV.put(key, JSON.stringify(stats));

  return json({ ok: true });
}

/* =========================
   GET /api/cookies/status
   → STATO DEFAULT (NO PROFILING)
========================= */
export async function getCookieStatus(): Promise<Response> {
  return json({
    necessary: true,
    analytics: false,
    marketing: false,
  });
}


=== FILE: cors/auth.cors.ts
LANG: ts
SIZE:     3077 bytes
----------------------------------------
// ======================================================
// INFRA — HTTP CORS RESOLUTION
// ======================================================
//
// RUOLO:
// - Single Source of Truth per CORS
// - Usato ESCLUSIVAMENTE da index.ts
//
// NON È:
// - dominio auth
// - dominio user
// - dominio session
// ======================================================

import type { Env } from "../../../types/env";
import { withVisitor } from "../visitor/visitor.response";
export type CorsMode = "PUBLIC" | "SOFT" | "HARD";

export function getCorsHeaders(
  request: Request,
  env: Env,
  mode: CorsMode
): HeadersInit {
  const origin = request.headers.get("Origin") || "";

  const allowedOrigins = [
    env.FRONTEND_URL,
    "https://webonday.it",
    "https://www.webonday.it",
    "http://localhost:5173",
    "http://localhost:5174",
  ];

  const isAllowed = allowedOrigins.includes(origin);

  // PUBLIC → no cookie, wildcard
  if (mode === "PUBLIC") {
    return {
"Access-Control-Allow-Origin": origin || env.FRONTEND_URL,
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    };
  }

  // SOFT / HARD → cookie + credentials
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : env.FRONTEND_URL,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-admin-token, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}
// ======================================================
// AUTH — CORS MODE RESOLUTION (SEMANTIC)
// ======================================================
//
// RUOLO:
// - Dichiarare il livello di auth richiesto
// - NON conosce HTTP
// - NON setta header
//
// È:
// - pura semantica auth
// ======================================================

export type AuthCorsMode = "PUBLIC" | "SOFT" | "HARD";

export function resolveAuthCorsMode(
  pathname: string
): AuthCorsMode {
  if (pathname === "/api/user/google/auth") {
    return "PUBLIC";
  }

  if (
    pathname === "/api/user/login" ||
    pathname === "/api/user/register" ||
    pathname === "/api/user/google/callback" ||
    pathname === "/api/user/me"
  ) {
    return "HARD";
  }

  if (pathname === "/api/user/logout") {
    return "HARD";
  }

  return "SOFT";
}


export function withCors(
    response: Response,
    request: Request,
    env: Env
  ): Response {
    const pathname = new URL(request.url).pathname;
  
    const mode = pathname.startsWith("/api/user/")
      ? resolveAuthCorsMode(pathname)
      : "HARD";
  
    const headers = new Headers(response.headers);
    const cors = getCorsHeaders(request, env, mode);
  
    for (const [k, v] of Object.entries(cors)) {
      headers.set(k, v);
    }
  
    return withVisitor(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      }),
      request
    );
  }
  

=== FILE: identity/auth.identity.google.ts
LANG: ts
SIZE:     1418 bytes
----------------------------------------
/**
 * ======================================================
 * AUTH SERVICE — USER RESOLUTION / CREATION
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Risolve o crea un utente applicativo partendo
 *   da una AuthIdentity normalizzata
 *
 * SOURCE OF TRUTH:
 * - ON_USERS_KV
 * - Mapping PROVIDER:{provider}:{providerUserId} → userId
 *
 * GARANZIE:
 * - 1 provider identity = 1 userId
 * - Email sempre normalizzata lowercase
 * - UserSchema valida SEMPRE l’output
 *
 * NON FA:
 * - NON crea sessioni
 * - NON imposta cookie
 * - NON autentica richieste HTTP
 *
 * PERCHÉ:
 * - Separare la creazione utente dal concetto di sessione
 * - Consentire login multipli (password / Google)
 * - Preparare future identity (Apple, Magic link, ecc.)
 *
 * NOTA ARCHITETTURALE:
 * - Questo file NON deve MAI dipendere da Request / Response
 * - È puro dominio + persistence
 * ======================================================
 */

import type { AuthIdentity } from "./auth.identity.types";

export function mapGooglePayload(payload: any): AuthIdentity {
    return {
      provider: "google",
      providerUserId: String(payload.sub),
      email: String(payload.email),
      emailVerified: Boolean(payload.email_verified),
      profile: {
        name: payload.name,
        picture: payload.picture,
        locale: payload.locale,
      },
    };
  }
  

=== FILE: identity/auth.identity.password.ts
LANG: ts
SIZE:     1136 bytes
----------------------------------------
/**
 * ======================================================
 * AUTH PROVIDER — PASSWORD
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Normalizzare un login password-based in AuthIdentity
 *
 * INVARIANTI:
 * - provider = "password"
 * - providerUserId = passwordHash (NON la password in chiaro)
 * - email sempre normalizzata lowercase
 *
 * SICUREZZA:
 * - passwordHash è già derivato (hash sicuro)
 * - NON viene mai esposto al frontend
 * - NON viene mai usato come identificatore pubblico
 *
 * NON FA:
 * - NON verifica la password (già fatto prima)
 * - NON crea utenti
 * - NON imposta sessioni
 *
 * PERCHÉ:
 * - Uniformare password e OAuth sotto lo stesso flusso
 * - Evitare pipeline separate
 * ======================================================
 */

import type { AuthIdentity } from "./auth.identity.types";


export function mapPasswordLogin(
    email: string,
    passwordHash: string
  ): AuthIdentity {
    return {
      provider: "password",
      providerUserId: passwordHash,
      email: email.toLowerCase(),
      emailVerified: true,
    };
  }
  

=== FILE: identity/auth.identity.types.ts
LANG: ts
SIZE:     1286 bytes
----------------------------------------
/**
 * ======================================================
 * AUTH TYPES — INTERNAL PIPELINE
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * QUESTI TIPI:
 * - Vivono SOLO nel backend
 * - NON attraversano il confine HTTP
 * - NON rappresentano una sessione
 *
 * PERCHÉ:
 * - Disaccoppiare identità da autenticazione
 * - Supportare più provider senza duplicare logica
 * ======================================================
 */
// backend/src/lib/auth/types.ts

/**
 * Provider di autenticazione supportati
 */
export type AuthProvider =
  | "password"
  | "google";

/**
 * Identità normalizzata dell’utente
 * (input interno all’auth pipeline)
 *
 * ⚠️ NON è salvata in KV
 * ⚠️ NON è esposta al frontend
 * ⚠️ NON è validata runtime
 */
export interface AuthIdentity {
  provider: AuthProvider;

  /**
   * ID univoco del provider
   * - password: email o hash
   * - google: sub
   */
  providerUserId: string;

  /** email normalizzata (lowercase) */
  email: string;

  /** true se il provider garantisce la verifica */
  emailVerified: boolean;

  /** Dati profilo opzionali */
  profile?: {
    name?: string;
    givenName?: string;
    familyName?: string;
    picture?: string;
    locale?: string;
  };
}


=== FILE: index.ts
LANG: ts
SIZE:     2535 bytes
----------------------------------------
/**
 * ======================================================
 * AUTH DOMAIN — PUBLIC EXPORTS
 * ======================================================
 *
 * Questo index è l’UNICO punto di accesso pubblico
 * al dominio auth.
 *
 * OBIETTIVO:
 * - Evitare import profondi e fragili
 * - Rendere chiare le responsabilità
 * - Impedire accoppiamenti sbagliati (cookie ≠ guard ≠ reader)
 *
 * REGOLA:
 * - Le route DEVONO importare SOLO da qui
 * ======================================================
 */

export { emitAuthLifecycleEvent } from "./lifecycle/auth.lifecycle.ar";

export { logoutUser } from "./route/user/auth.user.logout";
export { withCors } from "./cors/auth.cors";

export { resolveAuthCorsMode } from "./cors/auth.cors";

export { getCorsHeaders } from "./cors/auth.cors";

/* ======================================================
   IDENTITY (provider → AuthIdentity)
====================================================== */
export { mapGooglePayload } from "./identity/auth.identity.google";
export { mapPasswordLogin } from "./identity/auth.identity.password";
export {googleAuth ,googleCallback} from "./route/auth/google"
export type {
  AuthIdentity,
  AuthProvider,
} from "./identity/auth.identity.types";

/* ======================================================
   USER SERVICE (resolve / create user)
====================================================== */
export { resolveOrCreateUser } from "./user/auth.user.service";

/* ======================================================
   SESSION — COOKIE (HARD AUTH ONLY)
   ⚠️ NON legge cookie
   ⚠️ NON carica user
====================================================== */
export {
  buildSessionCookie,
  destroySessionCookie,
} from "./session/auth.session.cookies";

/* ======================================================
   SESSION — READER (NO GUARD)
   ✔️ cart
   ✔️ browsing
   ✔️ policy
====================================================== */
export {
  getUserIdFromSession,
  getUserFromSession,
} from "./session/auth.session.reader";

/* ======================================================
   SESSION — HARD AUTH GUARD
   ✔️ business
   ✔️ checkout
   ✔️ configurazioni user-owned
====================================================== */
export { requireAuthUser } from "./session/auth.session.guard";


export { registerUser } from "./route/user/auth.user.register";
export { loginUser } from "./route/user/auth.user.login";
export { getUser } from "./route/user/auth.user.me";





=== FILE: lifecycle/auth.lifecycle.ar.ts
LANG: ts
SIZE:     2326 bytes
----------------------------------------
/**
 * ======================================================
 * AUTH LIFECYCLE — PASSIVE ORCHESTRATOR
 * ======================================================
 *
 * RUOLO:
 * - Osservare eventi auth già avvenuti
 * - Normalizzare il lifecycle
 * - Centralizzare audit e coerenza
 *
 * NON FA:
 * - NON blocca flussi
 * - NON modifica sessioni
 * - NON tocca cookie
 * - NON lancia eccezioni
 *
 * DESIGN:
 * - Append-only
 * - Fail-safe (mai throw)
 * - Zero coupling HTTP
 * ======================================================
 */

export type AuthLifecycleState =
  | "PAGE_MOUNTED"
  | "VISITOR_SOFT"
  | "USER_CREATED"
  | "SESSION_ACTIVE"
  | "SESSION_CLOSED"
  | "USER_REVOKED";

export type AuthLifecycleEvent =
  | "PAGE_RENDERED"
  | "VISITOR_CREATED"
  | "AUTH_ATTEMPT"
  | "USER_CREATED"
  | "SESSION_CREATED"
  | "SESSION_USED"
  | "SESSION_REVOKED"
  | "USER_DELETED";

export interface AuthLifecycleInput {
  event: AuthLifecycleEvent;
  userId?: string;
  visitorId?: string;
  sessionId?: string; // futuro
  source: "route" | "guard" | "admin";
  meta?: Record<string, unknown>;
}

export interface AuthLifecycleRecord {
  event: AuthLifecycleEvent;
  derivedState: AuthLifecycleState;
  userId?: string;
  timestamp: string;
  consistency: "ok" | "violation";
}

/**
 * Stato derivato (NON persistito)
 */
function deriveState(
  event: AuthLifecycleEvent
): AuthLifecycleState {
  switch (event) {
    case "VISITOR_CREATED":
      return "VISITOR_SOFT";
    case "USER_CREATED":
      return "USER_CREATED";
    case "SESSION_CREATED":
    case "SESSION_USED":
      return "SESSION_ACTIVE";
    case "SESSION_REVOKED":
      return "SESSION_CLOSED";
    case "USER_DELETED":
      return "USER_REVOKED";
    default:
      return "PAGE_MOUNTED";
  }
}

/**
 * Emit passivo — non blocca mai
 */
export function emitAuthLifecycleEvent(
  input: AuthLifecycleInput
): AuthLifecycleRecord {
  const record: AuthLifecycleRecord = {
    event: input.event,
    derivedState: deriveState(input.event),
    userId: input.userId,
    timestamp: new Date().toISOString(),
    consistency: "ok",
  };

  // 🔒 Fail-safe assoluto
  try {
    // Qui in FASE 3: SOLO console / logActivity (opzionale)
    console.log("[AUTH_LIFECYCLE]", record);
  } catch {
    // silenzio assoluto
  }

  return record;
}


=== FILE: route/admin/guard/admin.guard.ts
LANG: ts
SIZE:      418 bytes
----------------------------------------
import { Env } from "../../../../../types/env";

export function requireAdmin(request: Request, env: Env): Response | null {
    const auth = request.headers.get("x-admin-token");
  
    if (!auth || auth !== env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    return null;
  }
  

=== FILE: route/auth/google.ts
LANG: ts
SIZE:     3810 bytes
----------------------------------------
// routes/auth/google.ts

import type { Env } from "../../../../types/env";
import { getCorsHeaders } from "@domains/auth/cors/auth.cors";
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
    state: encodeURIComponent(redirect), // verrà URL-encoded automaticamente
  });

  const headers = new Headers({
    Location:
      "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString(),
  });

  const cors = getCorsHeaders(request, env,"SOFT");
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
  if (
    redirectState.startsWith("http") ||
    redirectState.startsWith("//")
  ) {
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

  function base64UrlDecode(input: string) {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = input.length % 4;
    if (pad) input += "=".repeat(4 - pad);
    return atob(input);
  }
  
  const payload = JSON.parse(
    base64UrlDecode(tokenJson.id_token.split(".")[1])
  );
  


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
if ((redirectState.startsWith("http")) ||
redirectState.startsWith("//") ){
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


=== FILE: route/helper/frontendBase.ts
LANG: ts
SIZE:      457 bytes
----------------------------------------
import type { Env } from "../../../../types/env";
export function getFrontendBaseUrl(
  request: Request,
  env: Env
): string {
  const origin = request.headers.get("Origin");
  const referer = request.headers.get("Referer");

  // DEV: localhost
  if (origin?.includes("localhost")) {
    return "http://localhost:5173";
  }

  if (referer?.includes("localhost")) {
    return "http://localhost:5173";
  }

  // fallback PROD
  return env.FRONTEND_URL;
}


=== FILE: route/helper/http-local.ts
LANG: ts
SIZE:        0 bytes
----------------------------------------


=== FILE: route/helper/https.ts
LANG: ts
SIZE:      517 bytes
----------------------------------------
//superadmin.tsx
import type { Env } from "../../../../types/env";
import { getCorsHeaders } from "@domains/auth/cors/auth.cors";

export function json(
  body: unknown,
  request: Request,
  env: Env,
  status = 200
): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const cors = getCorsHeaders(request, env ,"HARD");
  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}


=== FILE: route/user/auth.user.login.ts
LANG: ts
SIZE:     2779 bytes
----------------------------------------
import type { Env } from "../../../../types/env";
import { logActivity } from "../../../activity/router/logActivity";
import { buildSessionCookie } from "../../session/auth.session.cookies";
import { getCorsHeaders } from "@domains/auth/cors/auth.cors";

/**
 * Helper JSON response standard + CORS
 */
function json(
  body: unknown,
  request: Request,
  env: Env,
  status = 200,
  extraHeaders?: HeadersInit
):Response {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...extraHeaders,
  });

  const cors = getCorsHeaders(request, env , "HARD");
  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}

/* ============================================================
   LOGIN USER (PASSWORD)
   POST /api/user/login
   ============================================================ */
export async function loginUser(request: Request, env: Env) {
    let body: { email: string; password: string };
  
    // 1️⃣ Parse body
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" },request, env, 401);
    }
  
    if (!body.email || !body.password) {
      return json({ error: "Missing credentials" }, request, env, 401

      );
    }
  
    const email = body.email.toLowerCase();
  
    // 2️⃣ Lookup via email index
    const userId = await env.ON_USERS_KV.get(`EMAIL:${email}`);
    if (!userId) {
      return json({ error: "Invalid credentials" }, request, env, 401);
    }
  
    const stored = await env.ON_USERS_KV.get(`USER:${userId}`);
    if (!stored) {
      return json({ error: "Invalid credentials" }, request, env, 401

      );
    }
  
    const user = JSON.parse(stored);
  
    // 3️⃣ Password check
    const hashBuf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(body.password)
    );
    const passwordHash = [...new Uint8Array(hashBuf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  
    if (passwordHash !== user.passwordHash) {
      return json({ error: "Invalid credentials" }, request, env, 401);
    }
  
    // 4️⃣ Activity log
    await logActivity(env, "LOGIN", user.id, {
      provider: "password",
      email: user.email,
      ip: request.headers.get("CF-Connecting-IP"),
      userAgent: request.headers.get("User-Agent"),
    });
  
    // 5️⃣ Session cookie (🔥 QUESTO ERA IL BUG)
    const cookie = buildSessionCookie(env, user.id ,request);
  
    return json(
      {
        ok: true,
        userId: user.id,
        userType: user.userType,
        membershipLevel: user.membershipLevel,
      },
      request , env , 
      200,
      { "Set-Cookie": cookie }
    );
  }


=== FILE: route/user/auth.user.logout.ts
LANG: ts
SIZE:     1014 bytes
----------------------------------------
import { requireAuthUser } from "@domains/auth/session/auth.session.guard";
import type { Env } from "../../../../types/env";
import { destroySessionCookie } from "@domains/auth/session/auth.session.cookies";

/* ============================================================
   LOGOUT — HARD
   POST /api/user/logout
   ============================================================ */
export async function logoutUser(
  request: Request,
  env: Env
): Promise<Response> {

  // 1️⃣ Leggi sessione (HARD requirement)
  const session = await requireAuthUser(request, env);

  if (!session) {
    return new Response(
      JSON.stringify({ ok: false, error: "AUTH_REQUIRED" }),
      { status: 401 }
    );
  }

  // 3️⃣ Distruggi cookie session
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    destroySessionCookie(env, request)
  );

  // 4️⃣ Risposta deterministica
  return new Response(
    JSON.stringify({ ok: true }),
    {
      status: 200,
      headers,
    }
  );
}


=== FILE: route/user/auth.user.me.ts
LANG: ts
SIZE:      984 bytes
----------------------------------------
import type { Env } from "../../../../types/env";
import { requireAuthUser } from "@domains/auth/session/auth.session.guard";

/**
 * Helper JSON response standard
 */
function json(body: unknown, status = 200, headers?: HeadersInit) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }
  


/* ============================================================
   GET CURRENT USER
   GET /api/user/me
   (userId risolto dal middleware/session)
   ============================================================ */
   export async function getUser(request: Request, env: Env) {
    const session = await requireAuthUser(request, env);
  
    if (!session) {
      return json(
        { ok: false, error: "UNAUTHORIZED" },
        401
      );
    }
  
    const { passwordHash, ...safeUser } = session.user;
  
    return json({
      ok: true,
      user: safeUser,
    });
  }


=== FILE: route/user/auth.user.register.ts
LANG: ts
SIZE:     2437 bytes
----------------------------------------
import type { Env } from "../../../../types/env";
import { buildSessionCookie } from "../../session/auth.session.cookies";
import { UserSchema ,UserInputSchema } from "@domains/according/user/Schema";
/**
 * Helper JSON response standard
 */
function json(body: unknown, status = 200, headers?: HeadersInit) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }
  

  
/* ============================================================
   REGISTER USER (PASSWORD)
   POST /api/user/register
   ============================================================ */
   export async function registerUser(request: Request, env: Env) {
    let input;
  
    // 1️⃣ Parse + validate input
    try {
      input = UserInputSchema.parse(await request.json());
    } catch (err) {
      return json({ error: "Invalid input", details: err }, 400);
    }
  
    const { email, password } = input;
    const normalizedEmail = email.toLowerCase();
  
    // 2️⃣ Email uniqueness check (index)
    const existingId = await env.ON_USERS_KV.get(`EMAIL:${normalizedEmail}`);
    if (existingId) {
      return json({ error: "Email already registered" }, 409);
    }
  
    // 3️⃣ Hash password (SHA-256)
    const hashBuf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(password)
    );
    const passwordHash = [...new Uint8Array(hashBuf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  
    const userId = crypto.randomUUID();
  
    // 4️⃣ Build raw user
    const userRaw = {
      id: userId,
      email: normalizedEmail,
      passwordHash,
     
 
      membershipLevel: "FREE",
      status: "active",
      createdAt: new Date().toISOString(),
    };
  
    // 5️⃣ Schema validation (Zod)
    let user;
    try {
      user = UserSchema.parse(userRaw);
    } catch (err) {
      return json({ error: "User validation failed", details: err }, 400);
    }
  
    // 6️⃣ Persist user + indexes
    await env.ON_USERS_KV.put(`USER:${user.id}`, JSON.stringify(user));
    await env.ON_USERS_KV.put(`EMAIL:${user.email}`, user.id);
  
    // 7️⃣ Create session immediately (UX + consistency)
    const cookie = buildSessionCookie(env, user.id,request);
  
    return json(
      { ok: true, userId: user.id },
      201,
      { "Set-Cookie": cookie }
    );
  }
  

=== FILE: session/auth.session.cookies.ts
LANG: ts
SIZE:     2441 bytes
----------------------------------------
/**
 * ======================================================
 * SESSION — USER AUTH (HARD)
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Gestire ESCLUSIVAMENTE la sessione utente autenticata
 *
 * SOURCE OF TRUTH:
 * - Cookie: webonday_session
 * - KV: ON_USERS_KV
 *
 * INVARIANTI:
 * - webonday_session contiene SOLO userId
 * - Se il cookie è presente ma l’utente non esiste → sessione invalida
 * - Tutti gli endpoint protetti DEVONO usare requireAuthUser()
 *
 * NON FA:
 * - NON gestisce visitor
 * - NON crea sessioni anonime
 * - NON fa fallback automatici
 *
 * PERCHÉ:
 * - Separare HARD AUTH (user) da SOFT SESSION (visitor)
 * - Evitare sessioni fantasma
 * - Rendere l’autenticazione auditabile
 *
 * NOTA CRITICA:
 * - Qualsiasi flusso visitor NON deve MAI passare da questo file
 * ======================================================
 */
/**
 * NOTA ARCHITETTURALE (INVARIANTE):
 *
 * - Questo file gestisce SOLO l’autenticazione HARD (user loggato)
 * - NON rappresenta l’identità applicativa globale
 * - NON conosce visitor, device, o sessioni soft
 *
 * L’identità applicativa (visitor / user / device)
 * è intenzionalmente ESTERNA a questo modulo.
 *
 * Questo consente:
 * - multi-device corretto
 * - persistenza visitor indipendente dal login
 * - assenza di side-effect post-login
 */

import type { Env } from "../../../types/env";
import { emitAuthLifecycleEvent } from "@domains/auth";

export function buildSessionCookie(
    env: Env,
    userId: string ,
    request?: Request
  ) {
    const origin = request?.headers.get("Origin") ?? "";
  const referer = request?.headers.get("Referer") ?? "";
  const isCrossSite =
  origin.startsWith("http://localhost") ||
  !origin.endsWith("webonday.it");

  const cookie = [
    `webonday_session=${userId}`,
    "Path=/",
    "HttpOnly",
    "Secure",                 // 🔒 OBBLIGATORIO
    "SameSite=None",          // 🔥 OBBLIGATORIO cross-site
    "Domain=.webonday.it",
    "Max-Age=2592000",
  ].join("; ");

 
   
    emitAuthLifecycleEvent({
      event: "SESSION_CREATED",
      userId,
      source: "route",
    });
  return cookie;

}

export function destroySessionCookie(
  env: Env , 
request?: Request) {


  return [
    "webonday_session=",
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=None",
    "Domain=.webonday.it",
    "Max-Age=0",
  ].join("; ");
}





=== FILE: session/auth.session.guard.ts
LANG: ts
SIZE:     1279 bytes
----------------------------------------
// backend/src/domains/auth/session/auth.session.guard.ts
/**
 * ======================================================
 * HARD AUTH GUARD
 * ======================================================
 *
 * RUOLO:
 * - Bloccare endpoint che richiedono user loggato
 *
 * USARE SOLO PER:
 * - checkout
 * - orders
 * - business
 * - configurazioni user-owned
 *
 * NON USARE PER:
 * - browsing pubblico
 * - cart
 * - visitor
 * ======================================================
 */
import type { Env } from "../../../types/env";
import { getUserIdFromSession } from "./auth.session.reader";
import { emitAuthLifecycleEvent } from "../lifecycle/auth.lifecycle.ar";
/**
 * HARD AUTH GUARD
 * Usare SOLO per endpoint protetti
 */
export async function requireAuthUser(
  request: Request,
  env: Env
): Promise<{ userId: string; user: any } | null> {
  const userId = getUserIdFromSession(request);
  if (!userId) return null;

  const raw = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
  
    // 🔵 LIFECYCLE — session usata (PASSIVO)
    emitAuthLifecycleEvent({
      event: "SESSION_USED",
      userId,
      source: "guard",
    });
  
    return { userId, user };
  } catch {
    return null;
  }
  
}


=== FILE: session/auth.session.reader.ts
LANG: ts
SIZE:     1544 bytes
----------------------------------------
import type { Env } from "../../../types/env";

/* ======================================================
   SESSION — HARD AUTH (USER)
   ======================================================

   SOURCE OF TRUTH:
   - Cookie: webonday_session (contiene SOLO userId)
   - KV: ON_USERS_KV (USER:{userId})

   NOTE:
   - Questo file NON crea cookie.
   - Questo file NON gestisce visitor.
   - Questo file NON fa fallback automatici.
====================================================== */

/* ======================================================
   LOW LEVEL — parse cookie only
====================================================== */
export function getUserIdFromSession(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") ?? "";

  // Match robusto: prende il valore fino a ';'
  const match = cookieHeader.match(/(?:^|;\s*)webonday_session=([^;]+)/);
  return match ? match[1] : null;
}

/* ======================================================
   MID LEVEL — load user (NOT a guard)
   ⚠️ Non usare per endpoint protetti.
====================================================== */
export async function getUserFromSession(
  request: Request,
  env: Env
): Promise<any | null> {
  const userId = getUserIdFromSession(request);
  if (!userId) return null;

  const raw = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    // KV corrotto o formato inatteso -> trattiamo come sessione invalida
    return null;
  }
}




=== FILE: user/auth.user.service.ts
LANG: ts
SIZE:     2220 bytes
----------------------------------------
/**
 * ======================================================
 * AUTH SERVICE — USER RESOLUTION / CREATION
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Risolve o crea un utente applicativo partendo
 *   da una AuthIdentity normalizzata
 *
 * SOURCE OF TRUTH:
 * - ON_USERS_KV
 * - Mapping PROVIDER:{provider}:{providerUserId} → userId
 *
 * GARANZIE:
 * - 1 provider identity = 1 userId
 * - Email sempre normalizzata lowercase
 * - UserSchema valida SEMPRE l’output
 *
 * NON FA:
 * - NON crea sessioni
 * - NON imposta cookie
 * - NON autentica richieste HTTP
 *
 * PERCHÉ:
 * - Separare la creazione utente dal concetto di sessione
 * - Consentire login multipli (password / Google)
 * - Preparare future identity (Apple, Magic link, ecc.)
 *
 * NOTA ARCHITETTURALE:
 * - Questo file NON deve MAI dipendere da Request / Response
 * - È puro dominio + persistence
 * ======================================================
 */

import type { AuthIdentity } from "../identity/auth.identity.types";
import type { Env } from "../../../types/env";
import { UserSchema } from "@domains/according/user/Schema";

export async function resolveOrCreateUser(
  env: Env,
  identity: AuthIdentity
): Promise<{ userId: string; isNew: boolean }> {

  const providerKey = `PROVIDER:${identity.provider}:${identity.providerUserId}`;

  let userId = await env.ON_USERS_KV.get(providerKey);

  if (userId) {
    return { userId, isNew: false };
  }

  // nuovo utente
  userId = crypto.randomUUID();

  const userRaw = {
    id: userId,
    email: identity.email.toLowerCase(),
  
    // 🔐 passwordHash ESISTE SOLO per auth "password"
    ...(identity.provider === "password"
      ? { passwordHash: identity.providerUserId }
      : {}),
  
    businessName: null,
    piva: null,
  
    userType: "private",
    membershipLevel: "FREE",
    status: "active",
    createdAt: new Date().toISOString(),
  };
  
  const user = UserSchema.parse(userRaw);

  await env.ON_USERS_KV.put(`USER:${user.id}`, JSON.stringify(user));
  await env.ON_USERS_KV.put(`EMAIL:${user.email}`, user.id);
  await env.ON_USERS_KV.put(providerKey, user.id);

  return { userId, isNew: true };
}


=== FILE: visitor/visitor.cookies.ts
LANG: ts
SIZE:     1437 bytes
----------------------------------------
/**
 * ======================================================
 * VISITOR COOKIES
 * ======================================================
 *
 * RUOLO:
 * - Creare e leggere cookie visitor
 *
 * INVARIANTI:
 * - Backend only
 * - Idempotente
 * - Nessuna dipendenza da auth/session
 */

const VISITOR_COOKIE = "webonday_visitor";
const VISITOR_TS_COOKIE = "webonday_visitor_ts";

function isLocal(request?: Request): boolean {
  const origin = request?.headers.get("Origin") ?? "";
  const referer = request?.headers.get("Referer") ?? "";
  return origin.includes("localhost") || referer.includes("localhost");
}

/**
 * Legge visitorId dal cookie (se esiste)
 */
export function readVisitorId(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const match = cookieHeader.match(
    /(?:^|;\s*)webonday_visitor=([^;]+)/
  );
  return match ? match[1] : null;
}

/**
 * Costruisce i Set-Cookie per un nuovo visitor
 */
export function buildVisitorCookies(
  visitorId: string,
  request?: Request
): string[] {
  const local = isLocal(request);
  const base = [
    "Path=/",
    local ? "" : "Secure",
    "SameSite=Lax",
    local ? "" : "Domain=.webonday.it",
    "Max-Age=2592000", // 30 giorni
  ]
    .filter(Boolean)
    .join("; ");

  const now = new Date().toISOString();

  return [
    `${VISITOR_COOKIE}=${visitorId}; ${base}`,
    `${VISITOR_TS_COOKIE}=${now}; ${base}`,
  ];
}


=== FILE: visitor/visitor.response.ts
LANG: ts
SIZE:      945 bytes
----------------------------------------
/**
 * ======================================================
 * VISITOR RESPONSE WRAPPER
 * ======================================================
 *
 * RUOLO:
 * - Applicare il Visitor (soft identity) alla Response HTTP
 *
 * INVARIANTI:
 * - NON altera il body
 * - NON altera status
 * - NON sovrascrive Set-Cookie esistenti
 * - NON conosce auth/session
 */

import { resolveVisitor } from "./visitor.service";

export function withVisitor(
  response: Response,
  request: Request
): Response {
  const { cookies } = resolveVisitor(request);

  // Nessun nuovo visitor → response invariata
  if (cookies.length === 0) {
    return response;
  }

  const headers = new Headers(response.headers);

  // Append, NON set (importante)
  for (const cookie of cookies) {
    headers.append("Set-Cookie", cookie);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}


=== FILE: visitor/visitor.service.ts
LANG: ts
SIZE:      908 bytes
----------------------------------------
/**
 * ======================================================
 * VISITOR SERVICE
 * ======================================================
 *
 * RUOLO:
 * - Risolvere o creare VisitorContext
 *
 * INVARIANTI:
 * - Idempotente
 * - Stateless
 * - Nessun side effect fuori dai cookie
 */

import { readVisitorId, buildVisitorCookies } from "./visitor.cookies";
import type { VisitorContext } from "./visitor.types";

export function resolveVisitor(
  request: Request
): { visitor: VisitorContext | null; cookies: string[] } {
  const existing = readVisitorId(request);

  // Visitor già presente → nessun Set-Cookie
  if (existing) {
    return {
      visitor: { visitorId: existing, isNew: false },
      cookies: [],
    };
  }

  // Nuovo visitor
  const visitorId = crypto.randomUUID();

  return {
    visitor: { visitorId, isNew: true },
    cookies: buildVisitorCookies(visitorId, request),
  };
}


=== FILE: visitor/visitor.types.ts
LANG: ts
SIZE:      376 bytes
----------------------------------------
/**
 * ======================================================
 * VISITOR TYPES
 * ======================================================
 *
 * RUOLO:
 * - Tipi minimi per Visitor (soft identity)
 *
 * NOTE:
 * - NON contiene userId
 * - NON contiene PII
 * - NON rappresenta una sessione
 */

export interface VisitorContext {
    visitorId: string;
    isNew: boolean;
  }
  

francescomaggi@MacBook-Pro auth % 