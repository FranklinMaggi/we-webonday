import type { Env } from "../../../../types/env";
import { logActivity } from "../../../legal/activity/router/logActivity";
import { buildSessionCookie } from "../../session/auth.session.cookies";
import { getCorsHeaders } from "@domains/auth/cors/auth.cors";
import { USER_EMAIL_INDEX,USER_KEY } from "@domains/legal/user/keys";
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
    const userId = await env.ON_USERS_KV.get(
      USER_EMAIL_INDEX(email));
    if (!userId) {
      return json({ error: "Invalid credentials" }, request, env, 401);
    }
  
    const stored = await env.ON_USERS_KV.get(USER_KEY(userId));
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
