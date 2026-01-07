// ======================================================
// FE || pages/user/configurator/[id]/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER CONFIGURATOR DETAIL (STEP 0)
// ======================================================
//
// RUOLO (ARCHITETTURALE):
// - Entry point REALE del flusso di configurazione
// - Step 0 logico (NON visibile) del wizard
// - Ponte tra BACKEND STATE e FRONTEND STATE
//
// COSA FA (OGGI):
// 1. Legge l'ID configurazione dalla URL
// 2. Recupera la Configuration dal backend
// 3. Recupera la Solution associata
// 4. Inizializza lo stato FE del wizard (Zustand)
// 5. Passa il controllo alla UI (ConfigurationSetupPage)
//
// COSA NON FA:
// - NON renderizza form
// - NON gestisce input utente
// - NON salva dati
// - NON decide logica di business
//
// PERCHÉ ESISTE:
// - Il backend è source of truth
// - Il wizard FE deve partire già "allineato"
// - Evita prefill sparsi e side-effect negli Step
//
// ======================================================
//
// FLUSSO COMPLETO (HIGH LEVEL):
//
// Cart → POST /configuration/from-cart
//        ↓
// /user/configurator/:id
//        ↓
// [QUI] UserConfiguratorDetail
//        ↓
// inizializza Zustand (una sola volta)
//        ↓
// ConfigurationSetupPage (wizard UI)
//        ↓
// StepBusinessInfo → StepDesign → StepContent → StepExtra → Review
//
// ======================================================
//
// STEP SUCCESSIVI (ROADMAP):
//
// STEP 1 — ConfigurationSetupPage
// - Orchestratore UI
// - Decide quale Step mostrare
// - NON inizializza dati
//
// STEP 2 — StepBusinessInfo
// - Input controllati
// - Scrive SOLO nello store
//
// STEP 5 — Review
// - Unico punto che potrà chiamare il backend
// - PATCH configuration
//
// ======================================================

import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import ConfigurationSetupPage from "../setup/ConfigurationSetupPage";
import { useConfigurationSetupStore } from "../setup/configurationSetup.store";

// =========================
// TYPES (LOCAL SNAPSHOT)
// =========================
type ConfigurationDTO = {
  id: string;
  solutionId: string;
  status: "draft" | "preview" | "ordered";
  business?: {
    id: string;
    name: string;
    type?: string;
    city?: string;
    email?: string;
    phone?: string;
  };
};

export default function UserConfiguratorDetail() {
  const { id } = useParams<{ id: string }>();

  const [config, setConfig] = useState<ConfigurationDTO | null>(null);
  const [solution, setSolution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { setField, reset } = useConfigurationSetupStore();

  /**
   * Guard per evitare:
   * - doppio prefill
   * - effetti collaterali in StrictMode
   */
  const prefilledRef = useRef(false);

  // ======================================================
  // FETCH CONFIGURATION (SOURCE OF TRUTH)
  // ======================================================
  useEffect(() => {
    if (!id) return;

    fetch(`/api/configuration/${id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setConfig(res.configuration);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ======================================================
  // FETCH SOLUTION (INDUSTRIES, CONTEXT)
  // ======================================================
  useEffect(() => {
    if (!config?.solutionId) return;

    fetch(`/api/solution?id=${config.solutionId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setSolution(res.solution);
      });
  }, [config?.solutionId]);

  // ======================================================
  // PREFILL FE STATE (STEP 0 INVISIBILE)
  // ======================================================
  //
  // PERCHÉ QUI:
  // - abbiamo backend + solution
  // - sappiamo se arriva da carrello
  // - possiamo inizializzare UNA SOLA VOLTA
  //
  useEffect(() => {
    if (!config || !solution) return;
    if (prefilledRef.current) return;

    // reset di sicurezza (opzionale, ma sano)
    reset();

    if (config.business?.name) {
      setField("businessName", config.business.name);
    }

    if (
      config.business?.type &&
      solution.industries?.includes(config.business.type)
    ) {
      setField("sector", config.business.type);
    }

    if (config.business?.city) {
      setField("city", config.business.city);
    }

    if (config.business?.email) {
      setField("email", config.business.email);
    }

    if (config.business?.phone) {
      setField("phone", config.business.phone);
    }

    // 🔒 blocca ulteriori prefill
    prefilledRef.current = true;
  }, [config, solution, reset, setField]);

  // ======================================================
  // GUARD UI
  // ======================================================
  if (!id) return <p>Configurazione non valida</p>;
  if (loading) return <p>Caricamento configurazione…</p>;
  if (!config) return <p>Configurazione non trovata</p>;

  // ======================================================
  // RENDER — PASSAGGIO DI CONTROLLO ALLA UI
  // ======================================================
  return (
    <section className="configuration-page">
      {/* HEADER MINIMO (CONTESTO) */}
      <header className="configuration-header">
        <div>
          <h1>{config.business?.name ?? "Il tuo progetto"}</h1>
          <p className="configuration-subtitle">
            Configurazione progetto — stato: {config.status}
          </p>
        </div>
      </header>

      {/* WIZARD UI */}
      <ConfigurationSetupPage
        configuration={config}
        industries={solution?.industries ?? []}
      />
    </section>
  );
}
