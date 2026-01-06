import type { Env } from "../../types/env";

export function buildSessionCookie(
    env: Env,
    userId: string
  ) {
    const isLocal = env.FRONTEND_URL.startsWith("http://localhost");
  
    return [
      `webonday_session=${userId}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=None",
      "Domain=.webonday.it",
      "Max-Age=2592000",
    ].join("; ");
  }
  
/**
 * LOW LEVEL — legge solo il cookie
 */
export function getUserIdFromSession(
  request: Request
): string | null {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(/webonday_session=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * MID LEVEL — carica user dal KV
 *//**
 * ⚠️ ATTENZIONE
 * Questa funzione NON è una guard.
 * NON usare per endpoint protetti.
 * Usare requireUser() per HARD-AUTH.
 */
export async function getUserFromSession(
  request: Request,
  env: Env
): Promise<any | null> {
  const userId = getUserIdFromSession(request);
  if (!userId) return null;

  const raw = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!raw) return null;

  return JSON.parse(raw);
}

/**
 * HIGH LEVEL — guard standard
 */
export async function requireUser(
  request: Request,
  env: Env
): Promise<{ userId: string; user: any } | null> {
  const userId = getUserIdFromSession(request);
  if (!userId) return null;

  const raw = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!raw) return null;

  return { userId, user: JSON.parse(raw) };
}
export function destroySessionCookie(env: Env) {
  return [
    "webonday_session=",
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=None",
    "Domain=.webonday.it",
    "Max-Age=0",
  ].join("; ");
}
