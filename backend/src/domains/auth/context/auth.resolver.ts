import type { Env } from "types/env";
import { AuthContext } from "./auth.context";
import { getUserIdFromSession } from "../session/auth.session.reader";
import { readVisitorId } from "@domains/legal/visitor/routes/visitor.cookies";

/**
 * ======================================================
 * AUTH CONTEXT RESOLVER
 * ======================================================
 *
 * RUOLO:
 * - Risolvere l'identità applicativa corrente
 * - SENZA accedere a KV
 * - SENZA validare l'utente
 *
 * PRIORITÀ:
 * 1. admin   (header hard)
 * 2. user    (cookie session)
 * 3. visitor (cookie legal)
 *
 * NOTA:
 * - La validazione user avviene SOLO nei guard
 * ======================================================
 */
export async function resolveAuthContext(
  request: Request,
  env: Env
): Promise<AuthContext> {
  /* =====================
     1️⃣ ADMIN (HARD)
  ====================== */
  const adminToken = request.headers.get("x-admin-token");
  if (adminToken && adminToken === env.ADMIN_TOKEN) {
    return { actor: "admin" };
  }

  /* =====================
     2️⃣ USER (SESSION)
  ====================== */
  const userId = getUserIdFromSession(request);
  if (userId) {
    return { actor: "user", userId };
  }

  /* =====================
     3️⃣ VISITOR (SOFT)
  ====================== */
  const visitorId = readVisitorId(request);

  if (!visitorId) {
    return { actor: "visitor" };
  }

  return { actor: "visitor", visitorId };
}