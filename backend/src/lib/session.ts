/** sessions.ts -> deprecated for space in requireUser
export function getUserIdFromSession(request: Request): string | null {
    const cookie = request.headers.get("Cookie") ?? "";
    const match = cookie.match(/webonday_session=([^;]+)/);
    return match ? match[1] : null;
  }
  **/