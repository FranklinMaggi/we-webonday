//superadmin.tsx
import type { Env } from "../../../../types/env";
import { getCorsHeaders } from "@domains/auth/cors/auth.cors";

export function json(
  body: unknown,
  request: Request,
  env: Env,
  status = 200
): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const cors = getCorsHeaders(request, env ,"HARD");
  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}
