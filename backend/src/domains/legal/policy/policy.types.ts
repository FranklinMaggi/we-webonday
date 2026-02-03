// ======================================================
// DOMAIN || LEGAL || POLICY DOCUMENT (CANONICAL)
// ======================================================
import { LegalActor } from "./actors.types";
export type PolicyType = 
  "cookie" | "privacy" | "terms";

export type PolicyScope =
  "general"| "configurator"| "checkout";

export type PolicyRenderMode = 
"readable" | "contractual";


export type PolicyReadableContent = {
  kind: "readable";
  title: string;
  body: string;       // markdown / html
  updatedAt: string; // ISO
};

export type PolicyContractualContent = {
  kind: "contractual";
  title: string;
  sections: {
    id: string;
    title: string;
    text: string;
  }[];
  updatedAt: string;
};


export type PolicyContent =
  | PolicyReadableContent
  | PolicyContractualContent;


  export interface PolicyDocument {
    /* ================= IDENTITY ================= */
    type: PolicyType;
    scope: PolicyScope;
    version: string;
  
    /* ================= RENDER ================= */
    renderMode: PolicyRenderMode;
  
    /* ================= LOCALIZATION ================= */
    locale: string; // "it-IT"
  
    /* ================= CONTENT ================= */
    content: PolicyContent;
  
    /* ================= LIFECYCLE ================= */
    effectiveAt: string;
    expiresAt?: string;
  
    /* ================= AUDIT ================= */
    checksum: string;
  }

  export interface PolicyDocument {
    type: PolicyType;
    scope: PolicyScope;
    version: string;
    renderMode: PolicyRenderMode;
    locale: string;
  
    content: PolicyContent;
  
    actors?: LegalActor[]; // 👈 QUI
  
    effectiveAt: string;
    expiresAt?: string;
    checksum: string;
  }