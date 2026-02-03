// @/domains/owner/keys.ts
export const OWNER_DRAFT_KEY = (configurationId: string) =>
    `OWNER_DRAFT:${configurationId}`;
  
  export const OWNER_DOCUMENTS_KEY = (configurationId: string) =>
    `OWNER_DOCUMENTS:${configurationId}`;
  
  export const OWNER_KEY = (configurationId: string) =>
    `OWNER:${configurationId}`;