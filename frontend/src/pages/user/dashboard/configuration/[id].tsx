// ======================================================
// FE || dashboard/configuration/[id].tsx
// ======================================================
//
// CONFIGURATION WORKSPACE — USER
//
// RUOLO:
// - Editor continuo configurazione
// - Stato = draft / preview / ordered
//
// ======================================================

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfigurationLayout from "./ConfigurationLayout";
import { type ConfigurationDTO } from "../../../../lib/apiModels/user/Configuration.api-model";

export default function UserConfigurationWorkspace() {
  const { id } = useParams<{ id: string }>();
  const [configuration, setConfiguration] = useState<ConfigurationDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/configuration/${id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setConfiguration(res.configuration as ConfigurationDTO);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return <p>ID configurazione mancante</p>;
  if (loading) return <p>Caricamento…</p>;
  if (!configuration) return <p>Configurazione non trovata</p>;

  return (
    <ConfigurationLayout configuration={configuration} />
  );
}
