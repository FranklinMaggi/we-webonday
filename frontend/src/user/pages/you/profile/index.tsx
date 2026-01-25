// ======================================================
// FE || USER DASHBOARD || PROFILE — INDEX
// ======================================================

import { useProfileContainer } from "./Profile.container";
import { ProfileView } from "./Profile.view";

export default function ProfilePage() {
  const user = useProfileContainer();
  return <ProfileView user={user} />;
}
