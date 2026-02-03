import type { Env } from "../../../../types/env";
import { logActivity } from "../../../legal/activity/router/logActivity";
import { buildSessionCookie } from "../../session/auth.session.cookies";
import { getCorsHeaders } from "@domains/auth/cors/auth.cors";

import {
  AUTH_USER_EMAIL_INDEX,
  AUTH_USER_KEY,
} from "@domains/auth/keys";

/**
 * Helper JSON response standard + CORS
 */
function json(
  body: unknown,
  request: Request,
  env: Env,
  status = 200,
  extraHeaders?: HeadersInit
): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...extraHeaders,
  });

  const cors = getCorsHeaders(request, env, "HARD");
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
export async function loginUser(
  request: Request,
  env: Env
): Promise<Response> {
  let body: { email: string; password: string };

  /* =====================
     1️⃣ PARSE BODY
  ====================== */
  try {
    body = await request.json();
  } catch {
    return json(
      { error: "INVALID_JSON_BODY" },
      request,
      env,
      401
    );
  }

  if (!body.email || !body.password) {
    return json(
      { error: "MISSING_CREDENTIALS" },
      request,
      env,
      401
    );
  }

  const email = body.email.toLowerCase();

  /* =====================
     2️⃣ LOOKUP USER ID
  ====================== */
  const userId = await env.ON_USERS_KV.get(
    AUTH_USER_EMAIL_INDEX(email)
  );

  if (!userId) {
    return json(
      { error: "INVALID_CREDENTIALS" },
      request,
      env,
      401
    );
  }

  /* =====================
     3️⃣ LOAD USER
  ====================== */
  const stored = await env.ON_USERS_KV.get(
    AUTH_USER_KEY(userId)
  );

  if (!stored) {
    return json(
      { error: "INVALID_CREDENTIALS" },
      request,
      env,
      401
    );
  }

  const user = JSON.parse(stored);

  /* =====================
     4️⃣ PASSWORD CHECK
  ====================== */
  const hashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body.password)
  );

  const passwordHash = [...new Uint8Array(hashBuf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (passwordHash !== user.passwordHash) {
    return json(
      { error: "INVALID_CREDENTIALS" },
      request,
      env,
      401
    );
  }

  /* =====================
     5️⃣ ACTIVITY LOG
  ====================== */
  await logActivity(env, "LOGIN", user.id, {
    provider: "password",
    email: user.email,
    ip: request.headers.get("CF-Connecting-IP"),
    userAgent: request.headers.get("User-Agent"),
  });

  /* =====================
     6️⃣ CREATE SESSION
  ====================== */
  const cookie = buildSessionCookie(
    env,
    user.id,
    request
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      userId: user.id,
      membershipLevel: user.membershipLevel,
    },
    request,
    env,
    200,
    { "Set-Cookie": cookie }
  );
}