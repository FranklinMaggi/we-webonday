// routes/auth/session.ts

import type { Env } from "../../types/env";
import { getUserFromSession } from "../../lib/auth/session";

export async function getCurrentUser(
  request: Request,
  env: Env
): Promise<Response> {
  const user = await getUserFromSession(request, env);
  return new Response(JSON.stringify({ ok: true, user }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function logoutUser(): Promise<Response> {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Set-Cookie": "webonday_session=; Path=/; Max-Age=0",
      "Content-Type": "application/json",
    },
  });
}
