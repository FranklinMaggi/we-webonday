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
