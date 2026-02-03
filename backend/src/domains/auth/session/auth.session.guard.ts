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
import { emitAuthLifecycleEvent } from "../lifecycle/auth.lifecycle.ar";
import { USER_KEY } from "@domains/legal/user/keys";
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

  const raw = await env.ON_USERS_KV.get(
    USER_KEY(userId)
  );
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
  
    // 🔵 LIFECYCLE — session usata (PASSIVO)
    emitAuthLifecycleEvent({
      event: "SESSION_USED",
      userId,
      source: "guard",
    });
  
    return { userId, user };
  } catch {
    return null;
  }
  
}
