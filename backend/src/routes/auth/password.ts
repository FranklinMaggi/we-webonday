// backend/src/routes/password.ts
/* ============================================================
   GET CURRENT USER
   GET /api/user/me
   ============================================================

   AI-SUPERCOMMENT — AUTH / SESSION GUARD

   RUOLO:
   - Espone l’utente corrente autenticato
   - Punto di verità per il frontend (bootstrap auth)
   - Base per ProtectedRoute, navbar, checkout, dashboard

   INVARIANTI:
   - Se NON esiste sessione → 401 UNAUTHORIZED
   - MAI rispondere 200 con user:null
   - L’utente è SEMPRE derivato dalla sessione
   - Il client NON passa userId

   PERCHÉ:
   - Evita sessioni fantasma
   - Elimina ambiguità FE
   - Rende il logout realmente invalidante
============================================================ */
import type { Env } from "../../types/env";
import { logActivity } from "../../lib/logActivity";
import { buildSessionCookie } from "../../lib/auth/session";
import { UserSchema, UserInputSchema } from "../../schemas/core/userSchema";
import { destroySessionCookie } from "../../lib/auth/session";
import { requireUser } from "../../lib/auth/session";
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

  const { email, password, piva, businessName } = input;
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
  const userType = piva ? "business" : "private";

  // 4️⃣ Build raw user
  const userRaw = {
    id: userId,
    email: normalizedEmail,
    passwordHash,
    businessName: businessName ?? null,
    piva: piva ?? null,
    userType,
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
  const cookie = buildSessionCookie(env, user.id);

  return json(
    { ok: true, userId: user.id },
    201,
    { "Set-Cookie": cookie }
  );
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
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (!body.email || !body.password) {
    return json({ error: "Missing credentials" }, 400);
  }

  const email = body.email.toLowerCase();

  // 2️⃣ Lookup via email index
  const userId = await env.ON_USERS_KV.get(`EMAIL:${email}`);
  if (!userId) {
    return json({ error: "Invalid credentials" }, 401);
  }

  const stored = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!stored) {
    return json({ error: "Invalid credentials" }, 401);
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
    return json({ error: "Invalid credentials" }, 401);
  }

  // 4️⃣ Activity log
  await logActivity(env, "LOGIN", user.id, {
    provider: "password",
    email: user.email,
    ip: request.headers.get("CF-Connecting-IP"),
    userAgent: request.headers.get("User-Agent"),
  });

  // 5️⃣ Session cookie (🔥 QUESTO ERA IL BUG)
  const cookie = buildSessionCookie(env, user.id);

  return json(
    {
      ok: true,
      userId: user.id,
      userType: user.userType,
      membershipLevel: user.membershipLevel,
    },
    200,
    { "Set-Cookie": cookie }
  );
}

/* ============================================================
   GET CURRENT USER
   GET /api/user/me
   (userId risolto dal middleware/session)
   ============================================================ */
   export async function getUser(request: Request, env: Env) {
    const session = await requireUser(request, env);
  
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
/* ============================================================
   LOGOUT
   POST /api/user/logout
   ============================================================ */
   export async function logoutUser(
    _request: Request,
    env: Env
  ): Promise<Response> {
    const headers = new Headers();
    headers.set("Set-Cookie", destroySessionCookie(env));
  
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers,
    });
  }