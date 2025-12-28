// BE || normalizers/normalizeProduct.ts
// ======================================================
// NORMALIZE PRODUCT — CORE (WebOnDay Products)
// ======================================================
//
// CONNECT POINT (CRITICO):
// - Input: record grezzo da PRODUCTS_KV (può essere legacy)
// - Output: oggetto compatibile con ProductSchema (CORE, source of truth)
// - La validazione NON si fa qui: si fa dopo con Zod ProductSchema
//
// NON FA:
// - business logic
// - sconti / pricing dinamico
// - accesso KV
//
// ======================================================

export function normalizeProduct(raw: any) {
  // =========================
  // OPTIONS
  // =========================
  // PERCHE: in KV esistono opzioni legacy (label / priceMonthly / priceYear)
  // quindi mappiamo SEMPRE su { id, name, type, price } coerente con ProductSchema.
  const options = Array.isArray(raw?.options)
    ? raw.options.map((o: any) => ({
        id: o?.id,
        name: o?.name ?? o?.label ?? "",
        type:
          o?.type ??
          (o?.priceMonthly != null
            ? "monthly"
            : o?.priceYear != null
            ? "yearly"
            : "one_time"),
        price: Number(
          o?.price ??
            o?.priceOneTime ??
            o?.priceMonthly ??
            o?.priceYear ??
            0
        ),
      }))
    : [];

  // =========================
  // PRODUCT CORE
  // =========================
  // PERCHE: alcuni prodotti storici usano title + priceMonthly/priceYear.
  // Qui facciamo solo coercion/fallback per arrivare a un oggetto validabile.
  return {
    id: raw?.id,

    // required by ProductSchema
    name: raw?.name ?? raw?.title ?? "",

    description: raw?.description ?? "",

    // una tantum
    startupFee: Number(raw?.startupFee ?? 0),

    // canoni (supporta anche legacy flat fields)
    pricing: {
      yearly: Number(raw?.pricing?.yearly ?? raw?.priceYear ?? 0),
      monthly: Number(raw?.pricing?.monthly ?? raw?.priceMonthly ?? 0),
    },

    deliveryTime: raw?.deliveryTime ?? "",
    flags: Array.isArray(raw?.flags) ? raw.flags : [],

    options,
  };
}
