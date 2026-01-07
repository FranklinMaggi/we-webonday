// ======================================================
// FE || src/lib/config.ts
// ======================================================
//
// RUOLO:
// - Definire il BASE URL per TUTTE le chiamate API FE → BE
//
// INVARIANTI:
// - Deve essere valorizzato a BUILD TIME
// - Se mancante → crash volontario (fail-fast)
//
// ======================================================

export const API_BASE = import.meta.env.VITE_API_BASE ?? "";

if (!API_BASE) {
  console.error(
    "[CONFIG] VITE_API_BASE non definita — build non valido"
  );
  throw new Error("FATAL: VITE_API_BASE non definita");
}

