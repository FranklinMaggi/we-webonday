// FE || pages/user/configurator/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATOR CANONICAL ENTRY
//
// 🧭 MAPPA CONCETTUALE (SOURCE OF TRUTH)
//
// ┌──────────────────────────────┐
// │  DASHBOARD / SOLUTION FLOW   │
// └──────────────┬───────────────┘
//                │
//                ▼
//      Configuration ESISTENTE (BE)
//                │
//                ▼
// ┌────────────────────────────────────────────┐
// │ /user/configurator/:id                     │
// │  → ConfigurationIndex (QUESTO FILE)        │
// └────────────────────────────────────────────┘
//                │
//                ▼
//  Fetch Configuration (BE = truth)
//                │
//                ▼
//  Prefill Zustand Store (FE only)
//                │
//                ▼
//  ConfigurationSetupPage (Wizard UI)
//                │
//                ▼
//  Salvataggio finale → status: draft
//                │
//                ▼
// ┌────────────────────────────────────────────┐
// │ /user/dashboard/configuration/:id          │
// │  → Workspace persistente post-wizard       │
// └────────────────────────────────────────────┘
//
// ======================================================
//
// RUOLO:
// - Entry point CANONICO e UNICO del configurator
// - Ponte tra Backend Configuration e Wizard UI
//
// SOURCE OF TRUTH:
// - Backend (ConfigurationDTO)
// - Zustand è SOLO una proiezione temporanea FE
//
// COSA FA:
// - Legge configurationId dalla URL
// - Fetcha /api/configuration/:id
// - Inizializza configurationSetupStore (BE → FE)
// - Fetcha Solution per seed tags / industries
// - Monta ConfigurationSetupPage (wizard UI)
//
// COSA NON FA (VINCOLANTE):
// - ❌ NON crea configuration
// - ❌ NON legge carrello
// - ❌ NON decide pricing
// - ❌ NON persiste dati (tranne via StepReview)
// - ❌ NON gestisce auth (delegato al layout)
//
// INVARIANTI CRITICI (NON NEGOZIABILI):
// 1. Questo è l’UNICO entry point del configurator
// 2. Senza configurationId valido → redirect dashboard
// 3. Nessun flusso può entrare da /configurator/start
// 4. Il wizard NON vive senza una Configuration BE
// 5. Zustand NON è mai source of truth
//
// COLLISIONI NOTE:
// - ❌ /configurator/start (legacy, NON usare)
// - ❌ /user/dashboard/[id] (catch-all legacy)
//
// STATO:
// - CANONICO
// - STABILE
// - BLOCCATO STRUTTURALMENTE
//
// ======================================================
// ======================================================
// AI-SUPERCOMMENT — CONFIGURATION READY_FOR_CHECKOUT
//
// DEFINIZIONE:
// Una Configuration è vendibile SOLO se:
// - solutionId presente
// - productId presente
// - layoutId selezionato
// - dati business minimi compilati
//
// RESPONSABILITÀ:
// - Il configurator GARANTISCE la completezza
// - Il checkout PRESUME una configuration valida
//
// INVARIANTI:
// - Nessun accesso al checkout da configurazioni incomplete
// - La validazione NON vive nel checkout
////Il configurator è l’unica interfaccia
//che modifica una Configuration.

//La modalità (wizard / workspace)
//dipende esclusivamente dallo status backend.
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
console.log("[CONFIGURATOR ENTRY]", {
  pathname: window.location.pathname,
  search: window.location.search,
});
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
