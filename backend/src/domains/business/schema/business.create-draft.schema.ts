import { z } from "zod";

/* =========================
   TIME RANGE (CANONICAL)
========================= */
const TimeRangeSchema = z.object({
  from: z.string(), // "HH:mm"
  to: z.string(),   // "HH:mm"
});

const OpeningHoursSchema = z.object({
  monday: z.array(TimeRangeSchema),
  tuesday: z.array(TimeRangeSchema),
  wednesday: z.array(TimeRangeSchema),
  thursday: z.array(TimeRangeSchema),
  friday: z.array(TimeRangeSchema),
  saturday: z.array(TimeRangeSchema),
  sunday: z.array(TimeRangeSchema),
});

/* =========================
   CREATE BUSINESS DRAFT
========================= */
export const CreateBusinessDraftSchema = z.object({
  configurationId: z.string(),
  solutionId: z.string(),
  productId: z.string(),

  businessName: z.string().min(1),

  openingHours: OpeningHoursSchema,

  contact: z.object({
    mail: z.string().email(),
    phoneNumber: z.string().optional(),
    pec: z.string().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        zip: z.string().optional(),
      })
      .optional(),
  }),

  businessDescriptionTags: z.array(z.string()).optional(),
  businessServiceTags: z.array(z.string()).optional(),

  privacy: z.object({
    accepted: z.literal(true),
    acceptedAt: z.string(),
    policyVersion: z.string(),
  }),
});
