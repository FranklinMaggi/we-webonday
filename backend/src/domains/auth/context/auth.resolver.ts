import type { Env } from "types/env";
import { AuthContext } from "./auth.context";
import { getUserIdFromSession } from "../session/auth.session.reader";
import { readVisitorId } from "@domains/legal/visitor/routes/visitor.cookies";

export async function resolveAuthContext(
  request: Request,
  env: Env
): Promise<AuthContext> {
  // 1️⃣ ADMIN (hard, header-based)
  const admin = request.headers.get("x-admin-token");
  if (admin && admin === env.ADMIN_TOKEN) {
    return { actor: "admin" };
  }

  // 2️⃣ USER (hard auth session)
  const userId = getUserIdFromSession(request);
  if (userId) {
    return { actor: "user", userId };
  }

  // 3️⃣ VISITOR (soft identity, legal-owned)
  const visitorId = readVisitorId(request);

// visitor esiste SOLO se cookie già accettati
if (!visitorId) {
    return { actor: "visitor" };
  }
  
  return { actor: "visitor", visitorId };
}