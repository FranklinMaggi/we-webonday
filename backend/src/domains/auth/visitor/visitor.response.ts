/**
 * ======================================================
 * VISITOR RESPONSE WRAPPER
 * ======================================================
 *
 * RUOLO:
 * - Applicare il Visitor (soft identity) alla Response HTTP
 *
 * INVARIANTI:
 * - NON altera il body
 * - NON altera status
 * - NON sovrascrive Set-Cookie esistenti
 * - NON conosce auth/session
 */

import { resolveVisitor } from "./visitor.service";

export function withVisitor(
  response: Response,
  request: Request
): Response {
  const { cookies } = resolveVisitor(request);

  // Nessun nuovo visitor → response invariata
  if (cookies.length === 0) {
    return response;
  }

  const headers = new Headers(response.headers);

  // Append, NON set (importante)
  for (const cookie of cookies) {
    headers.append("Set-Cookie", cookie);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
