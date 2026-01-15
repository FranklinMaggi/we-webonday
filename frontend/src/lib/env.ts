// ======================================================
// FE || src/lib/env.ts
// ======================================================
//
// SINGLE SOURCE OF TRUTH — ENVIRONMENT
//
// - Decide DEV vs PROD
// - Evita redirect cross-domain
// - Centralizza API_BASE
// ======================================================

const isDev = import.meta.env.MODE === "development";

export const ENV = {
  isDev,
  isProd: !isDev,

  API_BASE: import.meta.env.VITE_API_BASE,

  FRONTEND_ORIGIN: isDev
    ? "http://localhost:5173"
    : "https://www.webonday.it",
};
