import type { AuthIdentity } from "../types";
export function mapGooglePayload(payload: any): AuthIdentity {
    return {
      provider: "google",
      providerUserId: String(payload.sub),
      email: String(payload.email),
      emailVerified: Boolean(payload.email_verified),
      profile: {
        name: payload.name,
        picture: payload.picture,
        locale: payload.locale,
      },
    };
  }
  