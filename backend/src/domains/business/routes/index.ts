// ======================================================
// DOMAIN || BUSINESS || ROUTES INDEX
// ======================================================
//
// RUOLO:
// - Barrel unico per tutte le route business
// - Usato dal router principale
//
// NOTA:
// - SOLO route attive (no legacy)
// ======================================================

export { createBusinessDraft } from "./business.create-draft";

// ⚠️ FUTURE (quando riattivate):
 export { createBusiness } from "./business.create";
export { getBusiness } from "./business.get";
export { listBusinesses } from "./business.list";
export { submitBusiness } from "./business.submit";
export { uploadBusinessMenu } from "./uploadMenu";
