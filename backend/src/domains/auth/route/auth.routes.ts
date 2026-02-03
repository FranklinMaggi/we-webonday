// @/domains/auth/routes/auth.routes.ts
// ======================================================
// DOMAIN || AUTH || ROUTES PACK
// ======================================================
//
// RUOLO:
// - Router HTTP del dominio Auth
// - Match pathname + method
// - Delega ai singoli handler
//
// INVARIANTI:
// - Nessuna logica di business
// - Nessun accesso KV
// - Nessuna mutazione diretta
// ======================================================

import type { Env } from "types/env";

import {
  getUser,
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  googleCallback,
} from "./index";
import { getCorsHeaders } from "../cors/auth.cors";

export async function handleAuthRoutes(
  request: Request,
  env: Env
): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  const method = request.method;
// ✅ PRE-FLIGHT CORS (FONDAMENTALE)
if (method === "OPTIONS" && pathname.startsWith("/api/user/")) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request, env, "HARD"),
  });
}
  if (pathname === "/api/user/google/auth" && method === "GET")
    return googleAuth(request, env);

  if (pathname === "/api/user/google/callback" && method === "GET")
    return googleCallback(request, env);

  if (pathname === "/api/user/me" && method === "GET")
    return getUser(request, env);

  if (pathname === "/api/user/register" && method === "POST")
    return registerUser(request, env);

  if (pathname === "/api/user/login" && method === "POST")
    return loginUser(request, env);

  if (pathname === "/api/user/logout" && method === "POST")
    return logoutUser(request, env);

  return null;
}