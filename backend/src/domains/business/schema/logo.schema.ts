import {z} from "zod" ;

export const LogoSchema = z.object({
    objectKey: z.string(),
    url: z.string().url(),
    uploadedAt: z.string().datetime(),
  });
  