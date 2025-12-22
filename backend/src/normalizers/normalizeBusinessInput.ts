// backend/src/normalizers/normalizeBusinessInput.ts

/**
 * INPUT accettato dal form di registrazione business
 * (NON è il Business del dominio)
 */
export interface BusinessInput {
    name?: unknown;
    address?: unknown;
    phone?: unknown;
    openingHours?: unknown;
    referredBy?: unknown;
  }
  
  /**
   * Shape normalizzata e sicura,
   * pronta per essere inserita nel dominio
   */
  export interface NormalizedBusinessInput {
    name: string;
    address: string;
    phone: string;
    openingHours: string | null;
    referredBy: string | null;
  }
  
  /**
   * Normalizza input HTTP per creazione / update business.
   *
   * Responsabilità:
   * - coercion
   * - trim
   * - default
   *
   * NON fa:
   * - validazione Zod
   * - accesso a Env / KV
   * - decisioni di stato
   */
  export function normalizeBusinessInput(
    input: BusinessInput
  ): NormalizedBusinessInput {
    return {
      name: String(input.name ?? "").trim(),
      address: String(input.address ?? "").trim(),
      phone: String(input.phone ?? "").trim(),
  
      // Per ora coerente con BusinessSchema (string | undefined)
      openingHours:
        input.openingHours != null
          ? String(input.openingHours)
          : null,
  
      referredBy:
        input.referredBy != null
          ? String(input.referredBy)
          : null,
    };
  }
  