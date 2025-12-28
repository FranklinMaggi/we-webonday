/**
 * Chiave unica per token admin
 * (sessionStorage, no cookie)
 */
const ADMIN_TOKEN_KEY = "ADMIN_TOKEN";

/**
 * Legge token admin
 */
export function getAdminToken(): string | null {
  const t = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  return t && t.trim().length > 0 ? t : null;
}

/**
 * Salva token admin
 */
export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token.trim());
}

/**
 * Rimuove token admin
 */
export function clearAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

/**
 * Logout forzato admin
 */
export function adminLogout(): never {
  clearAdminToken();
  window.location.href = "/admin/login";
  throw new Error("Admin logged out");
}
