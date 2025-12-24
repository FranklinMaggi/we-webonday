import { z } from "zod";

export const OrderSetupSchema = z.object({
  businessName: z.string().min(1),
  sector: z.string().min(1),
  city: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),

  primaryColor: z.string().min(1),
  style: z.enum(["modern", "elegant", "minimal", "bold"]),

  description: z.string().min(1),
  services: z.string().min(1),
  cta: z.string().min(1),

  extras: z.object({
    maps: z.boolean(),
    whatsapp: z.boolean(),
    newsletter: z.boolean(),
  }),
});

export type OrderSetupDTO = z.infer<typeof OrderSetupSchema>;
