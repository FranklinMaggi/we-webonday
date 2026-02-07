import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useWorkspaceState } from "../workspace/workspace.state";
import WorkspaceIndex from "..";

export default function WorkspaceByBusiness() {
  const { id } = useParams<{ id: string }>();
  const { setActiveConfiguration } = useWorkspaceState();

  useEffect(() => {
    if (id) {
      setActiveConfiguration(id);
    }
  }, [id, setActiveConfiguration]);

  return <WorkspaceIndex />;
}
