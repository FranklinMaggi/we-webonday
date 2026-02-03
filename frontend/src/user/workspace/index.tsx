import WorkspaceShell from "./workspace.shell";
import WorkspaceSidebar from "./workspace.sidebar";
import WorkspacePreview from "./site-preview";

export default function WorkspaceIndex() {
  return (
    <WorkspaceShell
      sidebar={<WorkspaceSidebar />}
      preview={<WorkspacePreview />}
    />
  );
}