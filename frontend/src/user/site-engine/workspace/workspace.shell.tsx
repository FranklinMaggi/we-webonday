// ======================================================
// FE || WORKSPACE — SHELL
// ======================================================
//
// RUOLO:
// - Layout base del Workspace
// - Sidebar + Preview persistenti
//
// INVARIANTI:
// - Nessuna logica di dominio
// - Solo composizione UI
// ======================================================

import type { ReactNode } from "react";

type Props = {
  //sidebar: ReactNode;
  preview: ReactNode;
};

export default function WorkspaceShell({
  //sidebar,
  preview,
}: Props) {
  return (
    
    <div className="workspace-shell">
      {/* SIDEBAR 
      <aside className="workspace-sidebar">
        {sidebar}
      </aside>

      {/* PREVIEW */}
      <main className="workspace-preview">
        {preview}
      </main>
    </div>
  );
}
