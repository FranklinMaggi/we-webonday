import type { ProductDTO, ProductOptionDTO } from "../types";

export function normalizeProduct(raw: any): ProductDTO {
  return {
    id: raw.id,
    title: raw.title ?? raw.name,
    description: raw.description ?? "",
    basePrice: Number(raw.basePrice ?? raw.priceMonthly ?? 0),
    deliveryTime: raw.deliveryTime ?? "",
    flags: raw.flags ?? [],
    options: raw.options?.map(normalizeOption) ?? []
  };
}

export function normalizeOption(opt: any): ProductOptionDTO {
  return {
    id: opt.id,
    label: opt.label ?? opt.name,
    price: Number(opt.price ?? opt.priceOneTime ?? opt.priceMonthly ?? opt.priceYear ?? 0),
    recurring: !!opt.recurring
  };
}
