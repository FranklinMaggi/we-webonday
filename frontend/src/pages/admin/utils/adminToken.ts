// frontend/src/pages/admin/utils/adminToken.ts
// Gestione token admin su sessionStorage (niente cookie, niente sessione).
// Chiave unica e prevedibile per tutta la parte admin.

const KEY = "webonday_admin_token";

export function getAdminToken(): string | null {
  const t = sessionStorage.getItem(KEY);
  return t && t.trim().length > 0 ? t : null;
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(KEY, token.trim());
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(KEY);
}
