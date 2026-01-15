// backend/src/domains/auth/session/auth.session.guard.ts
/**
 * ======================================================
 * HARD AUTH GUARD
 * ======================================================
 *
 * RUOLO:
 * - Bloccare endpoint che richiedono user loggato
 *
 * USARE SOLO PER:
 * - checkout
 * - orders
 * - business
 * - configurazioni user-owned
 *
 * NON USARE PER:
 * - browsing pubblico
 * - cart
 * - visitor
 * ======================================================
 */
import type { Env } from "../../../types/env";
import { getUserIdFromSession } from "./auth.session.reader";

/**
 * HARD AUTH GUARD
 * Usare SOLO per endpoint protetti
 */
export async function requireAuthUser(
  request: Request,
  env: Env
): Promise<{ userId: string; user: any } | null> {
  const userId = getUserIdFromSession(request);
  if (!userId) return null;

  const raw = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!raw) return null;

  try {
    return { userId, user: JSON.parse(raw) };
  } catch {
    return null;
  }
}
