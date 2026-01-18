/**
 * ======================================================
 * VISITOR COOKIES
 * ======================================================
 *
 * RUOLO:
 * - Creare e leggere cookie visitor
 *
 * INVARIANTI:
 * - Backend only
 * - Idempotente
 * - Nessuna dipendenza da auth/session
 */

const VISITOR_COOKIE = "webonday_visitor";
const VISITOR_TS_COOKIE = "webonday_visitor_ts";

function isLocal(request?: Request): boolean {
  const origin = request?.headers.get("Origin") ?? "";
  const referer = request?.headers.get("Referer") ?? "";
  return origin.includes("localhost") || referer.includes("localhost");
}

/**
 * Legge visitorId dal cookie (se esiste)
 */
export function readVisitorId(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const match = cookieHeader.match(
    /(?:^|;\s*)webonday_visitor=([^;]+)/
  );
  return match ? match[1] : null;
}

/**
 * Costruisce i Set-Cookie per un nuovo visitor
 */
export function buildVisitorCookies(
  visitorId: string,
  request?: Request
): string[] {
  const local = isLocal(request);
  const base = [
    "Path=/",
    local ? "" : "Secure",
    "SameSite=Lax",
    local ? "" : "Domain=.webonday.it",
    "Max-Age=2592000", // 30 giorni
  ]
    .filter(Boolean)
    .join("; ");

  const now = new Date().toISOString();

  return [
    `${VISITOR_COOKIE}=${visitorId}; ${base}`,
    `${VISITOR_TS_COOKIE}=${now}; ${base}`,
  ];
}
