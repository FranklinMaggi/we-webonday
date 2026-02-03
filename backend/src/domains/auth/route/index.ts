// @/domains/auth/routes/index.ts
// ======================================================
// DOMAIN || AUTH || ROUTES BARREL (PACK)
// ======================================================
//
// RUOLO:
// - Punto unico di export per tutte le route Auth
// - Vieta import profondi nei router
//
// INVARIANTI:
// - SOLO export
// - NESSUNA logica
// - NESSUN accesso a Env / Request
//
// USO:
// import { loginUser, registerUser } from "@domains/auth/routes";
// ======================================================


/* ======================================================
   USER — PASSWORD
====================================================== */
export { loginUser } from "./user/auth.user.login";
export { registerUser } from "./user/auth.user.register";
export { logoutUser } from "./user/auth.user.logout";
export { getUser } from "./user/auth.user.me";
export { createUser } from "@domains/auth/route/user/auth.user.create-user";

/* ======================================================
   AUTH — OAUTH (GOOGLE)
====================================================== */
export { googleAuth, googleCallback } from "./auth/google";

/* ======================================================
   DOMAIN ROUTER
====================================================== */
export { handleAuthRoutes } from "./auth.routes";