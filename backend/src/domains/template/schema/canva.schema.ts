import { z } from "zod";
import { CanvasPageSchema } from "./canva.page.chema";


export const CanvasSchema = z.object({
    id: z.string(),
    type: z.enum(["single-page", "multi-page"]),
    pages: z.array(CanvasPageSchema),
  });
  