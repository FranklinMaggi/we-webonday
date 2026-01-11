// ======================================================
// FE || pages/user/configurator/[id]/index.tsx
// ======================================================
//
// CONFIGURATOR DETAIL — CANONICAL ENTRY - entry point per modificare 
//
// RUOLO:
// - Garantisce ESISTENZA Configuration
// - Bootstrap da cartStore se mancante
// - Usa SEMPRE /user/configurator/:id
//
// FLOW:
// 1. Se configurationId NON esiste → bootstrap BE
// 2. Fetch Configuration
// 3. Fetch Solution
// 4. Passa solutionTags al wizard
//
// INVARIANTI:
// - NO wizard FE-only
// - NO stato fantasma
// - Configuration è SEMPRE source of truth
// ======================================================

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ConfigurationSetupPage from "../../setup/ConfigurationSetupPage";
import { cartStore } from "../../../../../lib/cart/cart.store";

/* ======================================================
   TYPES (READ-ONLY)
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
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [configurationId, setConfigurationId] = useState<string | null>(
    id ?? null
  );
  const [config, setConfig] = useState<ConfigurationDTO | null>(null);
  const [solution, setSolution] = useState<SolutionDTO | null>(null);
  const [loading, setLoading] = useState(true);

  /* ======================================================
     STEP 1 — BOOTSTRAP CONFIGURATION (SE NECESSARIO)
  ====================================================== */
  useEffect(() => {
    if (configurationId) return;

    async function bootstrap() {
      const cart = cartStore.getState();
      const item = cart.items[0];

      if (!item) {
        navigate("/user");
        return;
      }

      const res = await fetch("/api/configuration/bootstrap", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solutionId: item.solutionId,
          productId: item.productId,
          optionIds: item.options.map((o) => o.id),
        }),
      }).then((r) => r.json());

      if (!res?.ok || !res.configurationId) {
        navigate("/user");
        return;
      }

      setConfigurationId(res.configurationId);
      navigate(`/user/configurator/${res.configurationId}`, {
        replace: true,
      });
    }

    bootstrap();
  }, [configurationId, navigate]);

  /* ======================================================
     STEP 2 — FETCH CONFIGURATION
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
     STEP 3 — FETCH SOLUTION (SEED TAGS)
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
     DERIVED — SOLUTION TAGS (SEED + USER)
  ====================================================== */
  const solutionTags = useMemo(() => {
    if (!solution) return [];
    return Array.from(
      new Set([
        ...(solution.tags ?? []),
        ...(solution.userGeneratedTags ?? []),
      ])
    );
  }, [solution]);

  /* ======================================================
     GUARDS
  ====================================================== */
  if (loading) return <p>Preparazione configurazione…</p>;
  if (!config) return <p>Configurazione non trovata</p>;

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <section className="configuration-page">
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
