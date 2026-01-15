// ======================================================
// FE || src/lib/config.ts
// ======================================================
//
// CONFIG — API BASE
//
// STRATEGIA:
// 1. VITE_API_BASE (env build-time)
// 2. Fallback hardcoded (produzione stabile)
//
// NOTE:
// - NON crashare l'app in produzione
// - Loggare chiaramente lo stato
// ======================================================

// ======================================================
// FE || src/lib/config.ts
// ======================================================
//
// CONFIG — SINGLE SOURCE OF TRUTH
//
// RESPONSABILITÀ:
// - API BASE (con fallback)
// - ENV detection (DEV / PROD)
// - Frontend origin
// - Protezione redirect cross-domain in DEV
// ======================================================

/* =========================
   ENV DETECTION
========================= */

export const IS_DEV = import.meta.env.MODE === "development";
export const IS_PROD = !IS_DEV;

/* =========================
   API BASE
========================= */

const ENV_API_BASE = import.meta.env.VITE_API_BASE;
const FALLBACK_API_BASE = "https://api.webonday.it";

export const API_BASE = ENV_API_BASE || FALLBACK_API_BASE;

/* =========================
   FRONTEND ORIGIN
========================= */

export const FRONTEND_ORIGIN = IS_DEV
  ? "http://localhost:5173"
  : "https://www.webonday.it";

/* =========================
   DIAGNOSTICA (BOOT)
========================= */

console.info("[CONFIG] ENV:", IS_DEV ? "development" : "production");
console.info("[CONFIG] API_BASE:", API_BASE);
console.info("[CONFIG] FRONTEND_ORIGIN:", FRONTEND_ORIGIN);

if (!ENV_API_BASE) {
  console.warn(
    "[CONFIG] VITE_API_BASE non definita — uso fallback:",
    FALLBACK_API_BASE
  );
}
