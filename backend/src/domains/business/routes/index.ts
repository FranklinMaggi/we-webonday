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

export { listAllBusinessDrafts } from "./deprecated/business.draft.list-get";

export { updateBusinessDraft } from "./business.update-draft";
export { createBusinessDraft } from "./business.create-draft";
export { getBusinessDraft } from "./business.get.base-draft";

// ⚠️ FUTURE (quando riattivate):
export { createBusiness } from "./deprecated/business.create";
export { getBusiness } from "./deprecated/business.get";
export { listBusinesses } from "./deprecated/business.list";
export { submitBusiness } from "./deprecated/business.submit";
export { uploadBusinessMenu } from "./deprecated/uploadMenu";
