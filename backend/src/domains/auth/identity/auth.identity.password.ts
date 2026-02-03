// ======================================================
// AUTH PROVIDER — PASSWORD
// ======================================================

import type { AuthIdentity } from "./auth.identity.types";

export function mapPasswordLogin(
  email: string
): AuthIdentity {
  return {
    provider: "password",
    providerUserId: email.toLowerCase(), // 👈 IDENTITÀ, non segreto
    email: email.toLowerCase(),
    emailVerified: false,
  };
}