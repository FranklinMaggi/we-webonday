// ======================================================
// FE || WORKSPACE — SHELL
// ======================================================
//
// RUOLO:
// - Layout principale del Workspace
// - Sidebar + Tools + Preview persistente
//
// INVARIANTI:
// - Preview SEMPRE montata
// - Tools cambiano a destra
// ======================================================

import {type  ReactNode } from "react";
import WorkspaceSidebar from "./workspace/workspace.sidebar";
import SiteContainer from "./preview/site.container";

type Props = {
  toolPanel: ReactNode;
};

export default function WorkspaceShell({ toolPanel }: Props) {
  return (
    <div className="workspace-shell">
      {/* SIDEBAR */}
      <WorkspaceSidebar />

      {/* TOOL AREA */}
      <main className="workspace-main">
        {toolPanel}
      </main>

      {/* PREVIEW — SEMPRE VIVA */}
      <aside className="workspace-preview">
        <SiteContainer />
      </aside>
    </div>
  );
}
