// ======================================================
// FE || pages/user/dashboard/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — DASHBOARD (CONFIGURATION-CENTRIC)
//
// RUOLO:
// - Dashboard intelligente
// - Lista le configurazioni come SEZIONI CHILD
// - Ogni sezione rappresenta UNA attività / configurazione
//
// SOURCE OF TRUTH:
// - Backend → listMyConfigurations()
//
// COMPORTAMENTO:
// - Click su sezione → /user/dashboard/workspace/:id
//
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listMyConfigurations } from "./configurator/api/configuration.user.api";
import type { ConfigurationConfiguratorDTO } from "./configurator/models/ConfigurationConfiguratorDTO";

export default function Dashboard() {
  const navigate = useNavigate();

  const [configs, setConfigs] = useState<ConfigurationConfiguratorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     LOAD CONFIGURATIONS
  ========================= */
  useEffect(() => {
    listMyConfigurations()
      .then((res) => {
        if (!res.ok) {
          throw new Error("LOAD_FAILED");
        }
        setConfigs(res.items ?? []);
      })
      .catch(() => {
        setError("Errore caricamento configurazioni");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* =========================
     UI GUARDS
  ========================= */
  if (loading) return <p>Caricamento dashboard…</p>;
  if (error) return <p className="error">{error}</p>;

  /* =========================
     RENDER
  ========================= */
  return (
    <section className="dashboard">

      {/* =========================
         HEADER
      ========================= */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Le tue configurazioni attive</p>
      </header>

      {/* =========================
         CONFIGURATIONS (CHILD SECTIONS)
      ========================= */}
      <section className="dashboard-configurations">
        {configs.length === 0 ? (
          <div className="workspace-empty">
            <h2>Nessuna configurazione</h2>
            <p>Non hai ancora creato nessuna attività.</p>

            <button
              className="user-cta primary"
              onClick={() => navigate("/solution")}
            >
              Inizia da una soluzione →
            </button>
          </div>
        ) : (
          configs.map((cfg) => (
            <ConfigurationSection
              key={cfg.id}
              config={cfg}
              onOpen={() =>
                navigate(`/user/dashboard/workspace/${cfg.id}`)
              }
            />
          ))
        )}
      </section>
    </section>
  );
}

/* ======================================================
   INTERNAL COMPONENT — CONFIGURATION SECTION
   (IA = semantica, non routing)
====================================================== */

type ConfigurationSectionProps = {
  config: ConfigurationConfiguratorDTO;
  onOpen: () => void;
};

function ConfigurationSection({
  config,
  onOpen,
}: ConfigurationSectionProps) {
  const businessName =
    config.prefill?.businessName || "Nuova attività";

  return (
    <div
      className="configuration-section"
      onClick={onOpen}
      role="button"
      tabIndex={0}
    >
      <div className="configuration-section__header">
        <h2 className="configuration-title">
          {businessName}
        </h2>

        <span
          className={`status status-${config.status}`}
        >
          {config.status}
        </span>
      </div>

      <div className="configuration-section__meta">
        <span>
          <strong>Solution:</strong> {config.solutionId}
        </span>

        <span>
          <strong>Product:</strong> {config.productId}
        </span>
      </div>

      {/* linea visiva di separazione */}
      <div className="configuration-divider" />
    </div>
  );
}
