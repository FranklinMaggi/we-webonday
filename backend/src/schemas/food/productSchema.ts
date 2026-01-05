import { z } from "zod";

export const ProductOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  price: z.number(),
  recurring: z.boolean().default(false),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  basePrice: z.number(),

  flags: z.array(z.string()),
  options: z.array(ProductOptionSchema),
});

export type ProductDTO = z.infer<typeof ProductSchema>;
export type ProductOptionDTO = z.infer<typeof ProductOptionSchema>;
