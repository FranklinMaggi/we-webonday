// ======================================================
// FE || USER DASHBOARD || PROFILE — INDEX
// ======================================================

import { useProfileContainer } from "./Profile.container";
import { ProfileView } from "./Profile.view";


export default function ProfilePage() {
  const {
    user: owner, // 👈 alias qui
    configuration,
    reloadProfile,
  } = useProfileContainer();

  return (
    <ProfileView
      owner={owner}
      configuration={configuration}
      reloadProfile={reloadProfile}
    />
  );
}