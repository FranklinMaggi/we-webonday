import { z } from "zod";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";

export const BusinessEditorStateDTO = z.object({
  id: z.string(),
  publicId: z.string(),

  name: z.string(),
  sector: z.string().optional(),

  address: z.string().optional(),

  /* ===== DESIGN ===== */
  layoutId: z.string(),
  style: z.string(),
  palette: z.string(),

  /* ===== MEDIA ===== */
  coverImageUrl: z.string().url(),
  galleryImageUrls: z.array(z.string().url()),

  /* ===== OPENING HOURS ===== */
  openingHours: OpeningHoursSchema.optional(),
});

export type BusinessViewDTO =
  z.infer<typeof BusinessEditorStateDTO>;
