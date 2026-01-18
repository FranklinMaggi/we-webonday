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
