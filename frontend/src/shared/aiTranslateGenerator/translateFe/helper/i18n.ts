/* ======================================================
   FE || TRANSLATE HELPER (AI-READY, BE OVERRIDE)
======================================================
@@@@@@  DEPRECATED   @@@@@@@@
AI-SUPERCOMMENT

RUOLO:
- Risolvere stringhe FE tramite key semantiche
- Usare copy dinamico fornito dal BE (se presente)
- Garantire fallback immediato in italiano

PRIORITÀ RISOLUZIONE:
1. Copy caricato dal BE (override)
2. Fallback IT hardcoded
3. Key stessa (debug visivo)

DECISIONI:
- Nessuna dipendenza esterna
- Nessun async nei componenti
- BE copy caricato UNA VOLTA (bootstrap)

====================================================== */

/* =========================
   FALLBACK ITALIANO (SAFE)
========================= */
const IT_FALLBACK: Record<string, string> = {
    // OPTION — PRODUCT
    "option.product.title.monthly_addons": "Servizi aggiuntivi mensili",
    "option.product.label.price_monthly": "+ {{price}} / mese",
    "option.product.aria.group": "Servizi aggiuntivi selezionabili",
    "option.product.aria.option_monthly": "{{label}} {{price}} al mese",
  };
  
  /* =========================
     BE COPY OVERRIDE (RUNTIME)
  ========================= */
  let BE_COPY: Record<string, string> = {};
  
  /* ======================================================
     INIT — LOAD COPY FROM BE
  ======================================================
  
  DA CHIAMARE:
  - una sola volta
  - all’avvio dell’app
  - oppure nel layout root
  
  Il BE deve rispondere con:
  {
    ok: true,
    copy: {
      "key": "value"
    }
  }
  
  ====================================================== */
  export function initFeTranslations(copyFromBe: Record<string, string>) {
    BE_COPY = copyFromBe ?? {};
  }
  
  /* =========================
     TRANSLATE FUNCTION
  ========================= */
  export function t(
    key: string,
    params?: Record<string, string | number>
  ): string {
    let text =
      BE_COPY[key] ??
      IT_FALLBACK[key] ??
      key;
  
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{{${k}}}`, String(v));
      }
    }
  
    return text;
  }
  