import { type ProductDTO, type ProductOptionDTO } from "../../dto/productDTO";

export function normalizeOption(raw: any): ProductOptionDTO {
  return {
    id: raw.id,
    label: raw.name ?? raw.label ?? "",
    price: Number(raw.price ?? 0),
    recurringType: raw.type,
  };
}

export function normalizeProduct(raw: any): ProductDTO {
  return {
    id: raw.id,
    title: raw.name ?? raw.title ?? "",
    description: raw.description ?? "",
    startupFee: Number(raw.startupFee ?? 0),
    pricing: {
      yearly: Number(raw.pricing?.yearly ?? 0),
      monthly: Number(raw.pricing?.monthly ?? 0),
    },
    deliveryTime: raw.deliveryTime ?? "",
    flags: raw.flags ?? [],
    options: Array.isArray(raw.options) ? raw.options.map(normalizeOption) : [],
  };
}
