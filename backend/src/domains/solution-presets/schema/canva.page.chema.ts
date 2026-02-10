import { z } from "zod";    
import { CanvasSectionSchema } from "./canvas.section.schema";

export const CanvasPageSchema = z.object({
    id: z.string(),
    path: z.string(), // "/" | "/menu"
    sections: z.array(CanvasSectionSchema),
  });
  