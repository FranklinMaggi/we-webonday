// ======================================================
// I18N — PROFILE (IT FALLBACK)
// ======================================================

import type { CopyMap } from "../../../core/types";

const profileCopy: CopyMap = {
  /* ================= BASE ================= */
  "profile.title": "Profilo",
  "profile.subtitle": "Informazioni personali associate al tuo account",

  "profile.not_available": "Profilo non disponibile",
  "profile.not_logged": "Devi effettuare l’accesso per visualizzare il profilo",

  /* ================= IDENTITY ================= */
  "profile.section.identity": "Dati anagrafici",
  "profile.firstName": "Nome",
  "profile.lastName": "Cognome",
  "profile.birthDate": "Data di nascita",
  "profile.address": "Indirizzo di residenza",

  /* ================= STATUS ================= */
  "profile.section.status": "Stato profilo",
  "profile.status": "Completezza",
  "profile.status.complete": "Profilo completo",
  "profile.status.incomplete": "Profilo incompleto",

  "profile.verified": "Verifica identità",
  "profile.verified.yes": "Verificato",
  "profile.verified.no": "Non verificato",

  /* ================= VERIFY — FLOW ================= */
  "profile.verify.cta": "Verifica identità",
  "profile.verify.title": "Verifica identità",
  "profile.verify.subtitle":
    "Controlla e modifica i tuoi dati. La verifica avverrà in due passaggi.",

  /* STEP 1 */
  "profile.verify.step1.title": "Dati del titolare",
  "profile.verify.step1.subtitle":
    "Verifica che i dati anagrafici siano corretti e carica il documento di identità.",

  "profile.verify.idFront": "Documento di identità (fronte)",
  "profile.verify.idBack": "Documento di identità (retro)",

  "profile.verify.confirmOwner":
    "Confermo che i dati del titolare sono corretti",

  /* STEP 2 */
  "profile.verify.step2.title": "Dati dell’attività",
  "profile.verify.step2.subtitle":
    "Inserisci i dati fiscali e i documenti dell’attività.",

  "profile.verify.vat": "Partita IVA",
  "profile.verify.chamber": "Visura camerale",
  "profile.verify.pec": "PEC dell’attività",

  /* ACTIONS */
  "profile.verify.next": "Continua",
  "profile.verify.back": "Indietro",
  "profile.verify.submit": "Invia richiesta di verifica",

  /* ================= PRIVACY ================= */
  "profile.section.privacy": "Privacy",
  "profile.privacy.accepted":
    "Hai già accettato l’informativa privacy",
  "profile.privacy.link": "Leggi l’informativa",

  /* ================= CONTACTS ================= */
  "profile.section.contacts": "Contatti",
  "profile.secondaryMail": "Email secondaria",

  /* ================= COMMON ================= */
  "common.cancel": "Annulla",
  "common.loading": "Caricamento in corso…",
};

export default profileCopy;
