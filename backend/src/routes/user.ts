import type { Env } from "../types/env";
import { logLogin } from "../lib/logActivity";
import { UserSchema, UserInputSchema } from "../schemas/userSchema";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json"},
  });
}

/* ===========================================
   REGISTER USER
   =========================================== */
export async function registerUser(request: Request, env: Env) {
  let parsedInput;

  try {
    const rawBody = await request.json();
    parsedInput = UserInputSchema.parse(rawBody);
  } catch (err) {
    return json({ error: "Invalid input", details: err }, 400);
  }

  const { email, password, piva, businessName } = parsedInput;

  // Controllo se email già registrata tramite indice
  const existingId = await env.ON_USERS_KV.get(`EMAIL:${email.toLowerCase()}`);
  if (existingId) {
    return json({ error: "Email already registered" }, 409);
  }

  const id = crypto.randomUUID();

  // Hash password SHA-256
  const hashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );
  const passwordHash = [...new Uint8Array(hashBuf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const userType = piva ? "business" : "private";

  const userRaw = {
    id,
    email: email.toLowerCase(),
    passwordHash,
    businessName: businessName ?? null,
    piva: piva ?? null,
    userType,
    membershipLevel: "FREE",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  let validatedUser;
  try {
    validatedUser = UserSchema.parse(userRaw);
  } catch (err) {
    return json({ error: "User validation failed", details: err }, 400);
  }

  // Salva user
  await env.ON_USERS_KV.put(`USER:${id}`, JSON.stringify(validatedUser));

  // Indice email → userId
  await env.ON_USERS_KV.put(`EMAIL:${validatedUser.email}`, id);

  return json({ ok: true, userId: id });
}


/* ===========================================
   LOGIN USER
   =========================================== */
export async function loginUser(request: Request, env: Env) {
  let body: { email: string; password: string };

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (!body.email || !body.password)
    return json({ error: "Missing credentials" }, 400);

  const email = body.email.toLowerCase();

  // lookup rapido tramite indice
  const userId = await env.ON_USERS_KV.get(`EMAIL:${email}`);
  if (!userId) return json({ error: "Invalid credentials" }, 401);

  const stored = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!stored) return json({ error: "Invalid credentials" }, 401);

  const user = JSON.parse(stored);

  // Hash password inserita
  const hashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body.password)
  );
  const passwordHash = [...new Uint8Array(hashBuf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (passwordHash !== user.passwordHash)
    return json({ error: "Invalid credentials" }, 401);

  return json({
    ok: true,
    userId: user.id,
    userType: user.userType,
    membershipLevel: user.membershipLevel,
  });
  
}
await logLogin(env, {
  userId: user.id,
  email: user.email,
  provider: "password",
  ip: request.headers.get("CF-Connecting-IP"),
  userAgent: request.headers.get("User-Agent"),
});

/* ===========================================
   GET USER /api/user/me?userId=UUID
   =========================================== */
export async function getUser(request: Request, env: Env) {
  const url = new URL(request.url);
  const id = url.searchParams.get("userId");

  if (!id) return json({ error: "Missing userId" }, 400);

  const stored = await env.ON_USERS_KV.get(`USER:${id}`);
  if (!stored) return json({ error: "User not found" }, 404);

  const { passwordHash, ...safeUser } = JSON.parse(stored);

  return json({ ok: true, user: safeUser });
}
