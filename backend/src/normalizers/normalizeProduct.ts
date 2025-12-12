import { ProductDTO, ProductOptionDTO } from "../dto/productDTO";

export function normalizeOption(raw: any): ProductOptionDTO {
  return {
    id: raw.id,
    label: raw.label ?? raw.name ?? "",
    price: Number(
      raw.price ??
      raw.priceOneTime ??
      raw.priceMonthly ??
      raw.priceYear ??
      0
    ),
    recurring: Boolean(raw.recurring),
  };
}

export function normalizeProduct(raw: any): ProductDTO {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? "",
    description: raw.description ?? "",
    basePrice: Number(raw.basePrice ?? raw.priceMonthly ?? 0),
    deliveryTime: raw.deliveryTime ?? "",
    flags: raw.flags ?? [],
    options: Array.isArray(raw.options)
      ? raw.options.map(normalizeOption)
      : [],
  };
}
