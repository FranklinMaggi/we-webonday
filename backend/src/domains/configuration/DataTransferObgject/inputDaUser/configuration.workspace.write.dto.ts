// ======================================================
// BE || ConfigurationWorkspaceWriteDto
// ======================================================
//
// RUOLO:
// - Aggiorna workspace UI-driven
// - NON cambia stato commerciale
// ======================================================

import { z } from "zod";

export const ConfigurationWorkspaceWriteSchema = z.object({
  configurationId: z.string().min(1),

  data: z.object({
    layoutId: z.string().optional(),
    themeId: z.string().optional(),
    lastPreviewAt: z.string().optional(),
  }),
});

export type ConfigurationWorkspaceWriteDto =
  z.infer<typeof ConfigurationWorkspaceWriteSchema>;
