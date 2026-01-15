import type { Env } from "../../../../types/env";
export function getFrontendBaseUrl(
  request: Request,
  env: Env
): string {
  const origin = request.headers.get("Origin");
  const referer = request.headers.get("Referer");

  // DEV: localhost
  if (origin?.includes("localhost")) {
    return "http://localhost:5173";
  }

  if (referer?.includes("localhost")) {
    return "http://localhost:5173";
  }

  // fallback PROD
  return env.FRONTEND_URL;
}
