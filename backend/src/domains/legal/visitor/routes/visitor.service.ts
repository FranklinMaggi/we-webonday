/**
 * ======================================================
 * VISITOR SERVICE
 * ======================================================
 *
 * RUOLO:
 * - Risolvere o creare VisitorContext
 *
 * INVARIANTI:
 * - Idempotente
 * - Stateless
 * - Nessun side effect fuori dai cookie
 */

import { readVisitorId, buildVisitorCookies } from "./visitor.cookies";
import type { VisitorContext } from "../schema/visitor.types";

export function resolveVisitor(
  request: Request
): { visitor: VisitorContext | null; cookies: string[] } {
  const existing = readVisitorId(request);

  // Visitor già presente → nessun Set-Cookie
  if (existing) {
    return {
      visitor: { visitorId: existing, isNew: false },
      cookies: [],
    };
  }

  // Nuovo visitor
  const visitorId = crypto.randomUUID();

  return {
    visitor: { visitorId, isNew: true },
    cookies: buildVisitorCookies(visitorId, request),
  };
}
