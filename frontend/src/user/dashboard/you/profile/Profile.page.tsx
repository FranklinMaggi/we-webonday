// ======================================================
// FE || USER DASHBOARD || PROFILE — INDEX
// ======================================================

import { useProfileContainer } from "./Profile.container";
import { ProfileView } from "./Profile.view";

export default function ProfilePage() {
  const {
    owner,
    reloadProfile,
  } = useProfileContainer();

  return (
    <ProfileView
      owner={owner}
      reloadProfile={reloadProfile}
    />
  );
}
