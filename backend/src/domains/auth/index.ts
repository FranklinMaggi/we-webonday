/**
 * ======================================================
 * AUTH DOMAIN — PUBLIC EXPORTS
 * ======================================================
 *
 * Questo index è l’UNICO punto di accesso pubblico
 * al dominio auth.
 *
 * OBIETTIVO:
 * - Evitare import profondi e fragili
 * - Rendere chiare le responsabilità
 * - Impedire accoppiamenti sbagliati (cookie ≠ guard ≠ reader)
 *
 * REGOLA:
 * - Le route DEVONO importare SOLO da qui
 * ======================================================
 */

export { emitAuthLifecycleEvent } from "./lifecycle/auth.lifecycle.ar";

export { logoutUser } from "./route/user/auth.user.logout";
export { withCors } from "./cors/auth.cors";

export { resolveAuthCorsMode } from "./cors/auth.cors";

export { getCorsHeaders } from "./cors/auth.cors";

/* ======================================================
   IDENTITY (provider → AuthIdentity)
====================================================== */
export { mapGooglePayload } from "./identity/auth.identity.google";
export { mapPasswordLogin } from "./identity/auth.identity.password";
export {googleAuth ,googleCallback} from "./route/auth/google"
export type {
  AuthIdentity,
  AuthProvider,
} from "./identity/auth.identity.types";

/* ======================================================
   USER SERVICE (resolve / create user)
====================================================== */
export { resolveOrCreateUser } from "./user/auth.user.service";

/* ======================================================
   SESSION — COOKIE (HARD AUTH ONLY)
   ⚠️ NON legge cookie
   ⚠️ NON carica user
====================================================== */
export {
  buildSessionCookie,
  destroySessionCookie,
} from "./session/auth.session.cookies";

/* ======================================================
   SESSION — READER (NO GUARD)
   ✔️ cart
   ✔️ browsing
   ✔️ policy
====================================================== */
export {
  getUserIdFromSession,
  getUserFromSession,
} from "./session/auth.session.reader";

/* ======================================================
   SESSION — HARD AUTH GUARD
   ✔️ business
   ✔️ checkout
   ✔️ configurazioni user-owned
====================================================== */
export { requireAuthUser } from "./session/auth.session.guard";


export { registerUser } from "./route/user/auth.user.register";
export { loginUser } from "./route/user/auth.user.login";
export { getUser } from "./route/user/auth.user.me";



