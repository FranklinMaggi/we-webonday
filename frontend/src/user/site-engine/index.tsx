import WorkspaceShell from "./workspace/workspace.shell";
//import WorkspaceSidebar from "./workspace.sidebar";
import WorkspacePreview from "./preview";

export default function WorkspaceIndex() {
  return (
    <WorkspaceShell
     // sidebar={<WorkspaceSidebar />}
      preview={<WorkspacePreview />}
    />
  );
}