// ======================================================
// FE || pages/user/configurator/[id]/index.tsx
// ======================================================
//
// CONFIGURATOR DETAIL — PRE-ORDER
//
// RUOLO:
// - Wizard di configurazione progetto
// - Stato = draft / preview
//
// NOTA:
// - NON esiste ancora orderId
// ======================================================

import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import ConfigurationSetupPage from "../setup/ConfigurationSetupPage";
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
export default function UserConfiguratorDetail() {
    const { id } = useParams<{ id: string }>();
    const [config, setConfig] = useState<ConfigurationDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [solution, setSolution] = useState<any>(null);
    useEffect(() => {
      if (!config?.solutionId) return;
    
      fetch(`/api/solution?id=${config.solutionId}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.ok) setSolution(res.solution);
        });
    }, [config?.solutionId]);
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
  
    if (!id) return <p>Configurazione non valida</p>;
    if (loading) return <p>Caricamento configurazione…</p>;
    if (!config) return <p>Configurazione non trovata</p>;
  
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
   configuration={config}  industries={solution?.industries ??[]} />
        
      </section>
    );
  }
