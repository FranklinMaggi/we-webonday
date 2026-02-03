import {z} from "zod" ;

export const CoverSchema = z.object({
    objectKey: z.string(),
    url: z.string().url(),
    uploadedAt: z.string().datetime(),
  });
  