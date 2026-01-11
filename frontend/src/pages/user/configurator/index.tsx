// ======================================================
// FE || pages/user/configurator/configuration/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION CANONICAL ENTRY
//
// RUOLO:
// - Entry point CANONICO del configuratore
// - Punto di verità UNICO dopo il login
// - Inizializza lo stato FE partendo ESCLUSIVAMENTE dal backend
//
// INVARIANTI FONDAMENTALI (NON NEGOZIABILI):
// 1. Il configurator NON dipende MAI dal carrello dopo il login
// 2. La Configuration BE è la SINGLE SOURCE OF TRUTH
// 3. Senza configurationId valido → il flusso NON parte
// 4. Nessuno step legge direttamente da cartStore
//
// COSA FA:
// - Legge :id dalla URL
// - Fetcha /api/configuration/:id
// - Popola configurationSetupStore con dati BE
// - Fetcha la Solution per ottenere solutionTags / industries
// - Monta il wizard (ConfigurationSetupPage)
//
// COSA NON FA:
// - ❌ NON crea configuration
// - ❌ NON modifica lo status
// - ❌ NON gestisce step / navigazione interna
// - ❌ NON legge il carrello
//
// SOURCE OF TRUTH:
// - Backend Configuration (CONFIGURATION_KV)
//
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate, useParams ,useLocation} from "react-router-dom";

import ConfigurationSetupPage from "./setup/ConfigurationSetupPage";
import { useConfigurationSetupStore } from "../../../lib/store/configurationSetup.store";

/* ======================================================
   TYPES (READ-ONLY VIEW MODELS)
====================================================== */

type ConfigurationDTO = {
  id: string;
  solutionId: string;
  productId?: string;
  options?: string[];
  businessTags?: string[];
  data?: any;
  status: string;
};


/* ======================================================
   COMPONENT
====================================================== */

export default function ConfigurationIndex() {
  const navigate = useNavigate();
  const { id: configurationId } = useParams<{ id: string }>();
  const location = useLocation() ; 
  const fromCart = new URLSearchParams(location.search).get("fromCart");
  const { setField, reset } = useConfigurationSetupStore();

  const [configuration, setConfiguration] =
    useState<ConfigurationDTO | null>(null);


  const [loading, setLoading] = useState(true);

 
 
 
  /* ======================================================
     GUARD — CONFIGURATION ID OBBLIGATORIO
  ====================================================== */
  
  useEffect(() => {
    if (!fromCart) return;
    // qui NON devi stare
    navigate("/user/dashboard");
  }, [fromCart]);
  
  
  useEffect(() => {
    if (!configurationId) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [configurationId, navigate]);

  /* ======================================================
     RESET STORE ON MOUNT
     (evita stati fantasma tra configurazioni diverse)
  ====================================================== */
  useEffect(() => {
    reset();
  }, [reset]);

  /* ======================================================
     STEP 1 — LOAD CONFIGURATION (SOURCE OF TRUTH)
  ====================================================== */
  useEffect(() => {
    if (!configurationId) return;

    async function loadConfiguration() {
      try {
        const res = await fetch(
          `/api/configuration/${configurationId}`,
          { credentials: "include" }
        );

        const json = await res.json();

        if (!json?.ok || !json.configuration) {
          navigate("/user");
          return;
        }

        const cfg: ConfigurationDTO = json.configuration;
        setConfiguration(cfg);

        // =========================
        // PREFILL STORE (BE → FE)
        // =========================
        setField("solutionId", cfg.solutionId);

        if (cfg.productId) {
          setField("productId", cfg.productId);
        }

        if (cfg.options) {
          setField("optionIds", cfg.options);
        }

        if (cfg.businessTags) {
          setField("businessTags", cfg.businessTags);
        }

        // Workspace data (se presente)
        if (cfg.data) {
          Object.entries(cfg.data).forEach(([key, value]) => {
            setField(key as any, value as any);
          });
        }
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
    if (!configuration) return;
  
    const solutionId = configuration.solutionId;
    if (!solutionId) return;
  
    async function loadSolution() {
      const res = await fetch(
        `/api/solution?id=${solutionId}`
      );
  
      const json = await res.json();
  
      if (json?.ok && json.solution) {
        const mergedTags = Array.from(
          new Set([
            ...(json.solution.tags ?? []),
            ...(json.solution.userGeneratedTags ?? []),
          ])
        );
      
        setField("solutionTags", mergedTags);
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
  return (
    <ConfigurationSetupPage/>
  );
}
