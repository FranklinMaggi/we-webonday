import { NavLink } from "react-router-dom";
import { useConfigurationSetupStore } from
  "@shared/domain/user/configurator/configurationSetup.store";

export default function WorkspaceSidebar() {
  const { data } = useConfigurationSetupStore();

  return (
    <aside className="workspace-sidebar">
      <h3 className="workspace-title">Workspace</h3>

      {/* ===== BUSINESS PREVIEW CONTEXT ===== */}
      {data.businessName && (
        <div className="workspace-business-preview">
          <strong className="workspace-business-name">
            {data.businessName}
          </strong>

          <div className="workspace-business-meta">
            <span>Anteprima sito attiva</span>
            {data.style && data.colorPreset && (
              <small>
                {data.style} · {data.colorPreset}
              </small>
            )}
          </div>
        </div>
      )}

      {/* ===== NAV ===== */}
      <nav className="workspace-nav">
        <NavLink to="preview">Preview</NavLink>
        <NavLink to="design">Design</NavLink>
        <NavLink to="upload">Upload</NavLink>
        <NavLink to="cms">Contenuti</NavLink>
      </nav>
    </aside>
  );
}
