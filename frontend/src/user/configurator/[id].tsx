// ======================================================
// FE || Configurator Entry — CANONICAL & MINIMAL
// ======================================================
//
// RUOLO:
// - Carica una Configuration ESISTENTE (BASE)
// - Inizializza lo store FE (Zustand)
// - Avvia il wizard UI
//
// INVARIANTI:
// - Nessuna creazione Configuration
// - Backend = source of truth
// - Senza configurationId → redirect
//
// ======================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getConfigurationForConfigurator,
} from "./base_configuration/configuration/configuration.user.api";

import { useConfigurationSetupStore } from "./base_configuration/configuration/configurationSetup.store";
import ConfigurationSetupPage from "./base_configuration/configuration/ConfigurationSetupPage";

export default function ConfigurationIndex() {
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { setField, reset } = useConfigurationSetupStore();
  const [loading, setLoading] = useState(true);

  /* ======================================================
     INIT — LOAD CONFIGURATION BASE
  ====================================================== */
  useEffect(() => {
    if (!configurationId) {
      navigate("/user/dashboard", { replace: true });
      return;
    }

    // 🔁 evita stati fantasma
    reset();

    getConfigurationForConfigurator(configurationId)
      .then((res) => {
        const cfg = res.configuration;

        if (!cfg) {
          navigate("/user/dashboard", { replace: true });
          return;
        }

        // ==========================================
        // 🔑 STORE INIT — BASE FIELDS ONLY
        // ==========================================
        setField("configurationId", cfg.id);
        setField("solutionId", cfg.solutionId);
        setField("productId", cfg.productId);
        

        // ⚠️ Prefill UX opzionale (NON dominio)
        if (cfg.prefill?.businessName) {
          setField("businessName", cfg.prefill.businessName);
        }





        
      })
      .catch(() => {
        navigate("/user/dashboard", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [configurationId, navigate, reset, setField]);

  /* ======================================================
     UI GUARD
  ====================================================== */
  if (loading) {
    return <p>Preparazione configurazione…</p>;
  }

  return <ConfigurationSetupPage />;
}
