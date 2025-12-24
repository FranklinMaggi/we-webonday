import { Env } from "../../types/env";

export function requireAdmin(request: Request, env: Env): Response | null {
    const auth = request.headers.get("x-admin-token");
  
    if (!auth || auth !== env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    return null;
  }
  