import type { AuthIdentity } from "../types";
export function mapPasswordLogin(
    email: string,
    passwordHash: string
  ): AuthIdentity {
    return {
      provider: "password",
      providerUserId: passwordHash,
      email: email.toLowerCase(),
      emailVerified: true,
    };
  }
  