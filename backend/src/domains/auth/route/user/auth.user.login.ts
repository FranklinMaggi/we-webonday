import type { Env } from "../../../../types/env";
import { logActivity } from "../../../activity/router/logActivity";
import { buildSessionCookie } from "../../session/auth.session.cookies";

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
