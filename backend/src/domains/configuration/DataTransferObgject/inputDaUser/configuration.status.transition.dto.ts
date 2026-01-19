// ======================================================
// BE || ConfigurationStatusTransitionDto
// ======================================================
//
// RUOLO:
// - Cambia stato Configuration
// - Validazioni lato BE
// ======================================================

import { z } from "zod";
import { CONFIGURATION_STATUS } from "@domains/configuration/schema/configuration.schema";

export const ConfigurationStatusTransitionSchema = z.object({
  configurationId: z.string().min(1),
  nextStatus: z.enum(CONFIGURATION_STATUS),
});

export type ConfigurationStatusTransitionDto =
  z.infer<typeof ConfigurationStatusTransitionSchema>;
