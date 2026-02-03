// auth.context.ts
export interface AuthContext {
    actor: "visitor" | "user" | "admin";
    userId?: string;
    visitorId?: string;
  }