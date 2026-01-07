// src/lib/config.ts


export const API_BASE = import.meta.env.VITE_API_BASE ?? "";

if (!API_BASE) {
  console.error(
    "[CONFIG] VITE_API_BASE non definita — build non valido"
  );
  throw new Error("FATAL: VITE_API_URL non definita");
  
}
