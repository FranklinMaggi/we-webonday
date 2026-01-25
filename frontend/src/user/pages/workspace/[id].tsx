// ======================================================
// FE || pages/user/dashboard/configurator/[id].tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION WORKSPACE DETAIL
//
// RUOLO:
// - Vista minima di una Configuration
// - CTA ESPLICITA verso il configurator canonico
//
// SOURCE OF TRUTH:
// - Backend → GET /api/configuration/:id
//
// NON FA:
// - ❌ NON contiene wizard
// - ❌ NON modifica configuration
//
// ======================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";

//import { getMyConfiguration } from "../configurator/api/configuration.user.api";
import { getConfigurationForConfigurator } from "../../configurator/base_configuration/configuration/configuration.user.api";
import type { ConfigurationConfiguratorDTO } from "../../configurator/base_configuration/configuration/ConfigurationConfiguratorDTO";


export default function UserConfigurationWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [configuration, setConfiguration] =
    useState<ConfigurationConfiguratorDTO | null>(null);
  const [loading, setLoading] = useState(true);

  if (!id) {
    return <Navigate to="/user/dashboard/configurator" replace />;
  }

  /* =========================
     LOAD CONFIGURATION (MINIMAL)
  ========================= */
  useEffect(() => {
    getConfigurationForConfigurator(id)
      .then((res) => {
        setConfiguration(res.configuration);
      })
      .catch(() => {
        setConfiguration(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  /* =========================
     UI STATES
  ========================= */
  if (loading) return <p>Caricamento configurazione…</p>;
  if (!configuration)
    return <p>Configurazione non trovata</p>;

  /* =========================
     RENDER
  ========================= */
  return (
    <section>
      <h2>Workspace configurazione</h2>

      <p>
        Stato: <strong>{configuration.status}</strong>
      </p>

      <p>
        Solution: <strong>{configuration.solutionId}</strong>
      </p>

      <div style={{ marginTop: 24 }}>
        <button
          className="user-cta primary"
          onClick={() =>
            navigate(
              `/user/dashboard/configurator/${configuration.id}`
            )
          }
        >
          Inizia / Riprendi configurazione →
        </button>
      </div>
    </section>
  );
}
