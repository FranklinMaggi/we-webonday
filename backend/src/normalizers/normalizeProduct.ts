/* ======================================================
   BACKEND || normalizeProduct — LEGACY → DOMAIN SHAPE
======================================================

SCOPO:
- Trasformare dati grezzi o legacy in una forma compatibile
  con il ProductSchema
- Preparare l’input alla validazione Zod

RESPONSABILITÀ:
- Coercion di tipi (Number, string fallback)
- Supporto a chiavi legacy (es. title → name)
- Uniformare la struttura delle opzioni
- Passare eventuali timestamp se presenti

REGOLE:
- NON valida (mai usare Zod qui)
- NON applica logica di business
- NON accede a KV o cache

FLUSSO:
Raw input → normalizeProduct → ProductSchema.parse()

NON DEVE FARE:
- NON creare dati mancanti di dominio
- NON decidere valori finali
- NON correggere errori semantici

NOTE:
- È tollerante verso input sporco
- La validazione avviene SEMPRE dopo, nello schema
====================================================== */

export function normalizeProduct(raw: any) {


  return {
    id: raw?.id,
    name: raw?.name ?? raw?.title ?? "",
    description: raw?.description ?? "",
    status: raw?.status ?? "DRAFT",
    startupFee: Number(raw?.startupFee ?? 0),
    pricing: {
      yearly: Number(raw?.pricing?.yearly ?? raw?.priceYear ?? 0),
      monthly: Number(raw?.pricing?.monthly ?? raw?.priceMonthly ?? 0),
    },
    deliveryTime: raw?.deliveryTime ?? "",
    flags: Array.isArray(raw?.flags) ? raw.flags : [],
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
    optionIds: Array.isArray(raw?.optionIds) ? raw.optionIds : [],
  };
}
