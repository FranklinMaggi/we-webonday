// ======================================================
// FE || WORKSPACE PREVIEW — LOCAL TYPES
// ======================================================

export type SitePreviewMode = "live" | "preview";

export type SitePreviewContext = {
  businessId: string;
  mode: SitePreviewMode;
};
