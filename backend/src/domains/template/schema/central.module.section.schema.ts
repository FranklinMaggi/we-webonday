import z from "zod";            

export const CentralModuleSectionSchema = z.object({
    type: z.literal("central-module"),
  
    module: z.enum([
      "menu",
      "booking",
      "transport-request",
    ]),
  
    source: z.literal("business"),
  });
  