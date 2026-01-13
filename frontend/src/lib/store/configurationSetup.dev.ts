// ======================================================
// FE || CONFIGURATION SETUP — DEV INIT
// ======================================================
//
// RUOLO:
// - Inizializza lo store in modalità DEV
// - SOLO in locale
//
// NON VA USATO IN PROD
// ======================================================

import { useConfigurationSetupStore } from "./configurationSetup.store";

export function initDevConfiguration() {
  const store = useConfigurationSetupStore.getState();

  // Evita doppia inizializzazione
  if (store.data.solutionId) return;

  store.setField("solutionId", "dev-solution-landing");
  store.setField("productId", "landing-essential");

  store.setField("businessName", "Pizzeria Da Franco");
  store.setField("sector", "Ristorazione");
  store.setField("address", "Via Roma 10, Bari");
  store.setField("city", "Bari");
  store.setField("state", "BA");
  store.setField("zip", "70100");

  store.setField("email", "test@webonday.dev");
  store.setField("privacyAccepted", true);

  // TAG finti (ma realistici)
  store.setField("solutionDescriptionTags", [
    "artigianale",
    "tradizione",
    "familiare",
  ]);

  store.setField("solutionServiceTags", [
    "pizza",
    "asporto",
    "forno a legna",
  ]);

  // Stato tecnico
  store.setConfigurationId("dev-config-001");
}
