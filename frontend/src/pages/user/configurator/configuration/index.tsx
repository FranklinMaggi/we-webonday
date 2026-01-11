// ======================================================
// FE || pages/user/configurator/configuration/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION INITIALIZER
//
// RUOLO:
// - Entry point CANONICO del configuratore
// - Inizializza lo stato FE (Zustand)
// - Garantisce che il wizard parta SEMPRE con dati validi
//
// COSA FA:
// - Verifica che esista un carrello valido
// - Preleva dati commerciali dal cartStore
// - Preleva email dalla sessione
// - Popola lo store configurationSetupStore
// - Monta il wizard UI (ConfigurationSetupPage)
//
// COSA NON FA:
// - ❌ NON gestisce step / navigazione interna
// - ❌ NON fa fetch backend
// - ❌ NON crea Configuration BE
// - ❌ NON salva nulla
//
// SOURCE OF TRUTH:
// - cartStore                → contesto commerciale
// - authStore                → utente loggato
// - configurationSetupStore  → stato wizard FE
//
// ======================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ConfigurationSetupPage from "../setup/ConfigurationSetupPage";

import { cartStore } from "../../../../lib/cart/cart.store";
import { useAuthStore } from "../../../../lib/store/auth.store";
import { useConfigurationSetupStore } from "../../../../lib/store/configurationSetup.store";

export default function ConfigurationInitializer() {
  const navigate = useNavigate();

  // =========================
  // STORE
  // =========================
  const { setField } = useConfigurationSetupStore();
  const { user } = useAuthStore();

  // ======================================================
  // INIT — PREFILL STORE
  // ======================================================
  useEffect(() => {
    // --------------------------------------
    // 1. GUARD — CARRELLO OBBLIGATORIO
    // --------------------------------------
    const cart = cartStore.getState();
    const item = cart.items[0];

    if (!item) {
      // Nessun prodotto selezionato → fuori dal flusso
      navigate("/user");
      return;
    }

    // --------------------------------------
    // 2. EMAIL DA SESSIONE
    // --------------------------------------
    if (user?.email) {
      setField("email", user.email);
    }

    // --------------------------------------
    // 3. CONTESTO COMMERCIALE
    // --------------------------------------
    setField("solutionId", item.solutionId);
    setField("productId", item.productId);
    setField(
      "optionIds",
      item.options.map((o) => o.id)
    );

    // NOTA:
    // - solutionTags NON vengono inizializzati qui
    // - arriveranno successivamente da Configuration BE / Solution
    // - il BusinessForm li leggerà dallo store quando disponibili
  }, [navigate, setField, user]);

  // ======================================================
  // RENDER
  // ======================================================
  // Il wizard UI è completamente delegato
  return <ConfigurationSetupPage />;
}
