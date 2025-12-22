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
      "Max-Age=2592000",
      isLocal ? "SameSite=Lax" : "SameSite=None",
      !isLocal && "Secure",
    ].filter(Boolean).join("; ");
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
