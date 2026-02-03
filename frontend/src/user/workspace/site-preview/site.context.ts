export type WorkspacePreviewMode =
  | "preview"   // editing
  | "live";     // sito pubblico simulato

export type WorkspacePreviewContext = {
  businessId: string;
  configurationId: string;
  mode: WorkspacePreviewMode;
};