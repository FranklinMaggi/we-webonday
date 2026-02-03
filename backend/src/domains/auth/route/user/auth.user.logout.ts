import type { Env } from "../../../../types/env";
import { requireAuthUser } from "@domains/auth/session/auth.session.guard";
import { destroySessionCookie } from "@domains/auth/session/auth.session.cookies";
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
   LOGOUT — HARD
   POST /api/user/logout
============================================================ */
export async function logoutUser(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH (HARD)
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "AUTH_REQUIRED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ DESTROY SESSION
  ====================== */
  const cookie = destroySessionCookie(env, request);

  /* =====================
     3️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true },
    request,
    env,
    200,
    { "Set-Cookie": cookie }
  );
}