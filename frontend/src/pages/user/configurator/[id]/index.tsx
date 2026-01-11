// ======================================================
// FE || pages/user/configurator/[id]/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATOR DETAIL (PRE-ORDER)
//
// RUOLO:
// - Entry point del wizard di configurazione ESISTENTE
// - Coordina:
//   • fetch Configuration (workspace)
//   • fetch Solution (seed semantico)
// - Deriva i dati necessari al wizard
//
// SOURCE OF TRUTH:
// - Backend (ConfigurationDTO, SolutionDTO)
//
// INVARIANTI:
// - NON crea ordini
// - NON gestisce checkout
// - NON muta dati backend
//
// ======================================================

import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ConfigurationSetupPage from "../setup/ConfigurationSetupPage";

/* ======================================================
   TYPES (LOCAL, READ-ONLY)
====================================================== */

type ConfigurationDTO = {
  id: string;
  solutionId: string;
  status: string;
  business?: {
    id: string;
    name: string;
    type?: string;
  };
};

type SolutionDTO = {
  id: string;
  tags?: string[];
  userGeneratedTags?: string[];
  industries?: string[];
};

/* ======================================================
   COMPONENT
====================================================== */

export default function UserConfiguratorDetail() {
  const { id: configurationId } = useParams<{ id: string }>();

  const [config, setConfig] = useState<ConfigurationDTO | null>(null);
  const [solution, setSolution] = useState<SolutionDTO | null>(null);
  const [loading, setLoading] = useState(true);

  /* ======================================================
     FETCH CONFIGURATION (WORKSPACE)
  ====================================================== */
  useEffect(() => {
    if (!configurationId) return;

    fetch(`/api/configuration/${configurationId}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.ok) setConfig(res.configuration);
      })
      .finally(() => setLoading(false));
  }, [configurationId]);

  /* ======================================================
     FETCH SOLUTION (SEMANTIC SEED)
     Dipende da config.solutionId
  ====================================================== */
  useEffect(() => {
    if (!config?.solutionId) return;

    fetch(`/api/solution?id=${config.solutionId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.ok) setSolution(res.solution);
      });
  }, [config?.solutionId]);

  /* ======================================================
     DERIVED DATA (ADHD-SAFE)
     - merge seed + user tags
     - dedupe
  ====================================================== */
  const solutionTags = useMemo(() => {
    if (!solution) return [];

    const seed = solution.tags ?? [];
    const user = solution.userGeneratedTags ?? [];

    return Array.from(new Set([...seed, ...user]));
  }, [solution]);

  /* ======================================================
     GUARDS
  ====================================================== */
  if (!configurationId) {
    return <p>Configurazione non valida</p>;
  }

  if (loading) {
    return <p>Caricamento configurazione…</p>;
  }

  if (!config) {
    return <p>Configurazione non trovata</p>;
  }

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <section className="configuration-page">
      {/* HEADER MINIMO */}
      <header className="configuration-header">
        <div>
          <h1>{config.business?.name ?? "Il tuo progetto"}</h1>
          <p className="configuration-subtitle">
            Configurazione progetto — stato: {config.status}
          </p>
        </div>
      </header>

      <ConfigurationSetupPage
        configuration={config}
        industries={solution?.industries ?? []}
        solutionTags={solutionTags}
      />
    </section>
  );
}
