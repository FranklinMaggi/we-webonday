// ======================================================
// BE || SITE PREVIEW || BUSINESS PREVIEW
// FILE: domains/site-preview/routes/business.preview.ts
//
// GET /api/user/business/:businessId/preview
// ======================================================
//
// RUOLO:
// - Restituire l’ANTEPRIMA del sito di un Business
// - Usato da:
//   • Workspace FE (preview live)
//   • Dominio pubblico (nomesito.webonday.it)
//
// INVARIANTI:
// - READ ONLY
// - Nessuna mutazione KV
// - Funziona anche se NON pubblicato
// - BUSINESS + CONFIGURATION = SOURCE OF TRUTH
// - La preview NON dipende dallo status
//
// ======================================================

import type { Env } from "../../../types/env";
import { json } from "@domains/auth/route/helper/https";
import { type BusinessViewDTO } from "../shcema/business-site.preview.schema";

/* ======================================================
   R2 IMAGE DEFAULTS — PUBLIC, SAFE, STABLE
====================================================== */

const R2_BASE_URL = "https://promptimg.webonday.it";

const DEFAULT_BUSINESS_IMAGES = {
  logoUrl: `${R2_BASE_URL}/default-business/logo.png`,
  heroUrl: `${R2_BASE_URL}/default-business/hero.png`,
  galleryUrls: [
    `${R2_BASE_URL}/default-business/gallery.png`,
  ],
};

/* ======================================================
   HANDLER
====================================================== */
export async function getBusinessPreview(
  request: Request,
  env: Env,
  businessId: string
): Promise<Response> {
  /* =====================
     1️⃣ LOAD BUSINESS
     PERCHÉ:
     - Contiene dati reali (nome, indirizzo, media, orari)
  ====================== */
  const business = (await env.BUSINESS_KV.get(
    `BUSINESS:${businessId}`,
    "json"
  )) as any;

  if (!business) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     2️⃣ LOAD CONFIGURATION
     PERCHÉ:
     - Contiene layout, stile, palette
     - È indipendente dallo stato commerciale
  ====================== */
  const configuration = (await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${business.configurationId}`,
    "json"
  )) as any;

  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     3️⃣ NORMALIZE ADDRESS
     PERCHÉ:
     - FE preview richiede stringa semplice
     - Evita logica nel frontend
  ====================== */
  const address = business.address
    ? [
        business.address.street,
        business.address.number,
        business.address.city,
      ]
        .filter(Boolean)
        .join(" ")
    : undefined;

  /* =====================
     4️⃣ RESOLVE IMAGES (DEFAULT-FIRST)
     PERCHÉ:
     - La preview NON deve mai rompersi
     - Gli asset utente verranno gestiti in step successivo
  ====================== */
  const logoUrl = DEFAULT_BUSINESS_IMAGES.logoUrl;
  const heroUrl = DEFAULT_BUSINESS_IMAGES.heroUrl;
  const galleryUrls = DEFAULT_BUSINESS_IMAGES.galleryUrls;

/* =====================
   5️⃣ BUILD PREVIEW DTO
   PERCHÉ:
   - Contract unico FE / pubblico
   - NO Zod runtime
   - DTO tollerante
====================== */
const preview: BusinessViewDTO = {
  /* ---------- Identity ---------- */
  configurationId: business.configurationId,
  isDraft: true,

  /* ---------- Business ---------- */
  businessName: business.businessName,
  contact: business.contact,
  address: business.address,

  /* ---------- Opening Hours ---------- */
  openingHours: business.openingHours,

  /* ---------- Tags ---------- */
 descriptionTags:
    business.businessDescriptionTags ?? [],
 serviceTags:
    business.businessServiceTags ?? [],

    businessDataComplete:true , 
};
  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(preview, request, env);
}