import {z} from "zod" ;




export const GalleryImageSchema = z.object({
    objectKey: z.string(),
    url: z.string().url(),
    order: z.number().int().min(0),
    uploadedAt: z.string().datetime(),
  });
  