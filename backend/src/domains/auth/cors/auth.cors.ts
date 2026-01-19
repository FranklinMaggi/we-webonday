// ======================================================
// INFRA — HTTP CORS RESOLUTION
// ======================================================
//
// RUOLO:
// - Single Source of Truth per CORS
// - Usato ESCLUSIVAMENTE da index.ts
//
// NON È:
// - dominio auth
// - dominio user
// - dominio session
// ======================================================

import type { Env } from "../../../types/env";
import { withVisitor } from "../visitor/visitor.response";
export type CorsMode = "PUBLIC" | "SOFT" | "HARD";

export function getCorsHeaders(
  request: Request,
  env: Env,
  mode: CorsMode
): HeadersInit {
  const origin = request.headers.get("Origin") || "";

  const allowedOrigins = [
    env.FRONTEND_URL,
    "https://webonday.it",
    "https://www.webonday.it",
    "http://localhost:5173",
    "http://localhost:5174",
  ];

  const isAllowed = allowedOrigins.includes(origin);

  // PUBLIC → no cookie, wildcard
  if (mode === "PUBLIC") {
    return {
"Access-Control-Allow-Origin": origin || env.FRONTEND_URL,
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    };
  }

  // SOFT / HARD → cookie + credentials
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : env.FRONTEND_URL,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-admin-token, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}
// ======================================================
// AUTH — CORS MODE RESOLUTION (SEMANTIC)
// ======================================================
//
// RUOLO:
// - Dichiarare il livello di auth richiesto
// - NON conosce HTTP
// - NON setta header
//
// È:
// - pura semantica auth
// ======================================================

export type AuthCorsMode = "PUBLIC" | "SOFT" | "HARD";

export function resolveAuthCorsMode(
  pathname: string
): AuthCorsMode {
  if (pathname === "/api/user/google/auth") {
    return "PUBLIC";
  }

  if (
    pathname === "/api/user/login" ||
    pathname === "/api/user/register" ||
    pathname === "/api/user/google/callback" ||
    pathname === "/api/user/me"
  ) {
    return "HARD";
  }

  if (pathname === "/api/user/logout") {
    return "HARD";
  }

  return "SOFT";
}


export function withCors(
    response: Response,
    request: Request,
    env: Env
  ): Response {
    const pathname = new URL(request.url).pathname;
  
    const mode = pathname.startsWith("/api/user/")
      ? resolveAuthCorsMode(pathname)
      : "HARD";
  
    const headers = new Headers(response.headers);
    const cors = getCorsHeaders(request, env, mode);
  
    for (const [k, v] of Object.entries(cors)) {
      headers.set(k, v);
    }
  
    return withVisitor(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      }),
      request
    );
  }
  