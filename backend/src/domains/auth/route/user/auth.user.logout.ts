import type { Env } from "../../../../types/env";
import { destroySessionCookie } from "../../session/auth.session.cookies";


  /* ============================================================
   LOGOUT
   POST /api/user/logout
   ============================================================ */
   export async function logoutUser(
    _request: Request,
    env: Env
  ): Promise<Response> {
    const headers = new Headers();
    headers.set("Set-Cookie", destroySessionCookie(env ,_request ));
  
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers,
    });
  }
  
