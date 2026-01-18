// ======================================================
// FE || pages/user/configurator/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATOR CANONICAL ENTRY
//
// RUOLO:
// - Entry point CANONICO e UNICO del configurator
// - Ponte tra Backend Configuration (truth) e Wizard UI
//
// SOURCE OF TRUTH:
// - Backend (ConfigurationConfiguratorDTO)
// - Zustand = proiezione temporanea FE
//
// INVARIANTI (BLOCCANTI):
// 1. Senza configurationId → redirect dashboard
// 2. Il wizard NON vive senza una Configuration BE
// 3. Nessuna creazione configuration lato FE
// 4. Zustand NON è mai source of truth
// 5. Nessun accesso da /configurator/start (legacy)
//
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import type {
  ConfigurationConfiguratorDTO,
} from "./models/Configuration.api-model";

import { getMyConfiguration } from "./api/configuration.user.api";
import { getSolutionById } from "../../../../domains/buyflow/api/publiApi/solutions/solutions.public.api";

import { useConfigurationSetupStore } from "./store/configurationSetup.store";
import ConfigurationSetupPage from "./setup/ConfigurationSetupPage";

/* ======================================================
   COMPONENT
====================================================== */

export default function ConfigurationIndex() {
  const navigate = useNavigate();
  const location = useLocation();

  const { id: configurationId } = useParams<{ id: string }>();
  const fromCart = new URLSearchParams(location.search).get("fromCart");

  const { setField, reset } = useConfigurationSetupStore();

  const [configuration, setConfiguration] =
    useState<ConfigurationConfiguratorDTO | null>(null);

  const [loading, setLoading] = useState(true);

  /* ======================================================
     GUARD — ACCESSO DA CARRELLO (NON AMMESSO)
  ====================================================== */
  useEffect(() => {
    if (!fromCart) return;
    navigate("/user/dashboard", { replace: true });
  }, [fromCart, navigate]);

  /* ======================================================
     GUARD — CONFIGURATION ID OBBLIGATORIO
  ====================================================== */
  useEffect(() => {
    if (!configurationId) {
      navigate("/user/dashboard", { replace: true });
      return;
    }
  }, [configurationId, navigate]);

  /* ======================================================
     RESET STORE ON CONFIG CHANGE
     (evita stati fantasma)
  ====================================================== */
  useEffect(() => {
    if (!configurationId) return;
    reset();
  }, [configurationId, reset]);

  /* ======================================================
     STEP 1 — LOAD CONFIGURATION (SOURCE OF TRUTH)
  ====================================================== */
  useEffect(() => {
    if (!configurationId) return;

    async function loadConfiguration() {
      try {
        const res = await getMyConfiguration(configurationId);
        const cfg = res.configuration;

        if (!cfg) {
          navigate("/user/dashboard", { replace: true });
          return;
        }

        // 🔵 Backend = truth
        setConfiguration(cfg);

        // 🔵 Prefill store FE (proiezione temporanea)
        setField("solutionId", cfg.solutionId);

        if (cfg.optionIds?.length) {
          setField("optionIds", cfg.optionIds);
        }
      } catch {
        navigate("/user/dashboard", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    loadConfiguration();
  }, [configurationId, navigate, setField]);

  /* ======================================================
     STEP 2 — LOAD SOLUTION (SEED TAGS / INDUSTRIES)
  ====================================================== */
  useEffect(() => {
    if (!configuration?.solutionId) return;

    async function loadSolution() {
      try {
        const res = await getSolutionById(configuration.solutionId);

        if (res.ok && res.solution) {
          const mergedTags = Array.from(
            new Set([
              ...(res.solution.tags ?? []),
              ...(res.solution.userGeneratedTags ?? []),
            ])
          );

          setField("solutionServiceTags", mergedTags);
        }
      } catch {
        // Non blocca il configurator
      }
    }

    loadSolution();
  }, [configuration, setField]);

  /* ======================================================
     GUARDS UI
  ====================================================== */
  if (loading) {
    return <p>Preparazione configurazione…</p>;
  }

  if (!configuration) {
    return <p>Configurazione non trovata</p>;
  }

  /* ======================================================
     RENDER — DELEGA TOTALE AL WIZARD
  ====================================================== */
  return <ConfigurationSetupPage />;
}
