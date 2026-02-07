// ======================================================
// FE || pages/user/dashboard/configurator/index.tsx
// ======================================================
import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { listMyConfigurations } from "./api/configuration.list.user.api";
import type { ConfigurationUserSummaryDTO } from "./api/DataTransferObject/ConfigurationConfiguratorDTO";
import { useConfigurationSetupStore } from "@src/user/editor/api/type/configurator/configurationSetup.store";
import { getWdStatusClass } from "@shared/utils/statusUi";
import { getPreConfiguration } from "./api/getPreconfiguration";



export default function ListConfigurationIndex() {
  const navigate = useNavigate();

  const [items, setItems] = useState<ConfigurationUserSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: configurationId } = useParams<{ id: string }>();

  const { setField, reset } = useConfigurationSetupStore();


  /* =========================
     LOAD CONFIGURATIONS
  ========================= */
  useEffect(() => {
    listMyConfigurations()
      .then((res) => {
        if (res.ok) {
          setItems(res.items ?? []);
        } else {
          setError("Errore caricamento configurazioni");
        }
      })
      .catch(() => {
        setError("Errore di rete");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

useEffect(() => {
    if (!configurationId) {
   
      return;
    }
    getPreConfiguration(configurationId)
      .then((res) => {
        const cfg = res.configuration;

        if (!cfg) {
          navigate("/user/dashboard", { replace: true });
          return;
        }

        // ==========================================
        // 🔑 STORE INIT — BASE FIELDS ONLY
        // ==========================================*/
        setField("configurationId", cfg.id);
        setField("solutionId", cfg.solutionId);
        setField("productId", cfg.productId);
     

        // prefill UX (non obbligatorio)
        setField(
          "businessName",
          cfg.businessName ?? ""
        );
      })
      .catch(() => {
        navigate("/user/dashboard", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [configurationId, navigate, reset, setField]);
  /* =========================
     UI STATES
  ========================= */
  if (loading) return <p>Caricamento configurazioni…</p>;
  if (error) return <p className="error">{error}</p>;

  if (items.length === 0) {
    return (
      <section className="workspace-empty">
        <h2>Nessuna configurazione</h2>
        <p>
          Non hai ancora iniziato nessuna configurazione.
        </p>

        <button
          className="user-cta primary"
          onClick={() => navigate("/solution")}
        >
          Inizia da una soluzione
        </button>
      </section>
    );
  }

  /* =========================
     RENDER LIST
  ========================= */
  return (
    <section className="workspace-list">
      <header className="workspace-header">
        <h1>Le tue configurazioni</h1>
        <p>
          Seleziona una configurazione per continuare il lavoro
        </p>
      </header>

      <div className="workspace-grid">
        {items.map((config) => (
          <div
            key={config.id}
            className="workspace-card"
            onClick={() =>
              navigate(`/user/dashboard/configurator/${config.id}`)
            }
          >
            <div className="workspace-card__header">
            <h3>
            {config.display?.businessName || "Nuova attività"}
             </h3>

             <span className={getWdStatusClass(config.status)}>
                {config.status}
              </span>
            </div>

            <div className="workspace-card__body">
              <p>
                <strong>Solution:</strong>{" "}
                {config.solutionId}
              </p>

              <p>
                <strong>Ultimo aggiornamento:</strong>{" "}
                {}
              </p>
            </div>

            <div className="workspace-card__footer">
              <span className="workspace-cta">
                Apri workspace →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
 //DEPRECATED 