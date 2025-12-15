// src/lib/config.ts

export const API_BASE = import.meta.env.VITE_API_URL as string;

if (!API_BASE) {
  throw new Error(
    "[CONFIG] VITE_API_URL non definita. Controlla il file .env"
  );
}
