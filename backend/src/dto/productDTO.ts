// DTO ufficiali condivisi con il frontend
// v2 — pricing esplicito (startup / yearly / monthly)
/* ======================================================
   BACKEND || Products Routes — CORE DOMAIN
======================================================

SCOPO:
- Esporre i prodotti WebOnDay tramite API
- Gestire lettura pubblica e scrittura admin
- Garantire che solo dati validi entrino nel sistema

RESPONSABILITÀ:
- Lettura prodotti da PRODUCTS_KV
- Normalizzazione input (normalizeProduct)
- Validazione dominio (ProductSchema)
- Scrittura atomica (upsert)

REGOLE DI ACCESSO:
- PUBLIC:
  - vede SOLO prodotti con status === "ACTIVE"
- ADMIN:
  - può creare / aggiornare prodotti
  - passa SEMPRE da registerProduct

FLUSSO REGISTER:
1. Auth admin
2. JSON parse
3. normalizeProduct
4. Iniezione timestamps di dominio
5. ProductSchema.parse (fail-fast)
6. Persistenza in KV

TIMESTAMPS:
- createdAt: impostato solo alla prima creazione
- updatedAt: aggiornato a ogni save
- Mai gestiti dal frontend

NON DEVE FARE:
- NON fidarsi del frontend
- NON salvare dati non validati
- NON esporre prodotti non ACTIVE al pubblico

NOTE:
- Se ProductSchema rifiuta → 500 = sistema sano
====================================================== */

export type RecurringType = "one_time" | "yearly" | "monthly";

export interface ProductOptionDTO {
  id: string;
  label: string;
  price: number;
  type: RecurringType;
}

export interface ProductPricingDTO {
  yearly: number;
  monthly: number;
}

export interface ProductDTO {
  id: string;
  name: string;
  nameKey?:string; 
  description: string;
  descriptionKey?:string; 

  // prezzo di avvio (una tantum)
  startupFee: number;

  // canoni ricorrenti del prodotto
  pricing: ProductPricingDTO;


  
  options: ProductOptionDTO[];
}
