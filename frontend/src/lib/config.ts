// src/lib/config.ts


export const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error("FATAL: VITE_API_URL non definita");
}
