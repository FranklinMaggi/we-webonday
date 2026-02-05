// @domains/owner/keys.ts
export const OWNER_KEY = (userId: string) =>
  `OWNER:${userId}`;

export const OWNER_DOCUMENTS_KEY = (userId: string) =>
  `OWNER_DOCUMENTS:${userId}`;
