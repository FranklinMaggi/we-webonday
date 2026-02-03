// ======================================================
// DOMAIN || LEGAL || POLICY DOCUMENT (CANONICAL)
// ======================================================

export type PolicyType = "cookie" | "privacy" | "terms";

export type PolicyScope =
  | "general"| "configurator"| "checkout";

export interface PolicyDocument {
  /* ================= IDENTITY ================= */

  type: PolicyType;          // cookie | privacy | terms
  scope: PolicyScope;        // general | configurator | checkout
  version: string;           // es: "v1", "v2", "2026-01"

  /* ================= LOCALIZATION ================= */

  locale: string;            // es: "it-IT" (future-proof)

  /* ================= CONTENT ================= */

  title: string;             // titolo umano
  body: string;              // Markdown / HTML

  /* ================= LIFECYCLE ================= */

  effectiveAt: string;       // ISO date (inizio validità)
  expiresAt?: string;        // ISO date (opzionale)

  /* ================= AUDIT ================= */

  checksum: string;          // hash contenuto (immutabilità)
}