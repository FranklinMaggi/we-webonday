// ======================================================
// FE || WORKSPACE PREVIEW — CONTAINER
// ======================================================

import { useMemo } from "react";
import { useWorkspaceState } from "../workspace.state";
import { useConfigurationPreview } from "./site-loader";
import { buildCanvas } from
  "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.builder";
import SiteView from "./site.view";

export default function SiteContainer() {
  const { activeConfigurationId } = useWorkspaceState();

  const { data, loading, error } =
    useConfigurationPreview(activeConfigurationId);

  const canvas = useMemo(() => {
    if (!data) return null;
    return buildCanvas(data);
  }, [data]);

  if (!activeConfigurationId) {
    return (
      <div className="workspace-preview-empty">
        <h3>Nessuna configurazione selezionata</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="workspace-preview-loading">
        Caricamento…
      </div>
    );
  }

  if (error) {
    return (
      <div className="workspace-preview-error">
        {error}
      </div>
    );
  }

  if (!canvas) return null;

  return <SiteView canvas={canvas} />;
}