import type { Env } from "../../../../types/env";
import { buildSessionCookie } from "../../session/auth.session.cookies";
import { UserSchema, UserInputSchema } from "../../../user/user.schema";

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
  