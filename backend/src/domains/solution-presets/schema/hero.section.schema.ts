import {z} from "zod"; 

export const HeroSectionSchema = z.object({
    type: z.literal("hero"),
  
    background: z.object({
      source: z.enum(["business.coverImage", "prompt"]),
    }),
  
    title: z.object({
      source: z.literal("business.name"),
    }),
  
    description: z.object({
      source: z.literal("business.description"),
    }),
  });
  