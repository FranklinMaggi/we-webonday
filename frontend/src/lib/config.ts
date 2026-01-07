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

const ENV_API_BASE = import.meta.env.VITE_API_BASE;
const FALLBACK_API_BASE = "https://api.webonday.it";

export const API_BASE = ENV_API_BASE || FALLBACK_API_BASE;

/* =========================
   DIAGNOSTICA (BOOT)
========================= */
if (!ENV_API_BASE) {
  console.warn(
    "[CONFIG] VITE_API_BASE non definita — uso fallback:",
    FALLBACK_API_BASE
  );
} else {
  console.info("[CONFIG] API_BASE da env:", ENV_API_BASE);
}
