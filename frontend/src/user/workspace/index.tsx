// ======================================================
// FE || USER WORKSPACE — ENTRY
// ======================================================

import { Routes, Route, Navigate } from "react-router-dom";
import WorkspaceShell from "./workspace.shell";

import DesignPanel from "./tools/design/design.panel";
import UploadPanel from "./tools/upload/upload.panel";
import CmsPanel from "./tools/cms/cms.panel";

export default function Workspace() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <WorkspaceShell
            toolPanel={<DesignPanel />}
          />
        }
      />

      <Route
        path="design"
        element={
          <WorkspaceShell
            toolPanel={<DesignPanel />}
          />
        }
      />

      <Route
        path="upload"
        element={
          <WorkspaceShell
            toolPanel={<UploadPanel />}
          />
        }
      />

      <Route
        path="cms"
        element={
          <WorkspaceShell
            toolPanel={<CmsPanel />}
          />
        }
      />

      <Route
        path="*"
        element={<Navigate to="design" replace />}
      />
    </Routes>
  );
}
