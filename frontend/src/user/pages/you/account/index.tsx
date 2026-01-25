// ======================================================
// FE || USER DASHBOARD || ACCOUNT — INDEX
// ======================================================

import { useAccountContainer } from "./Account.container";
import { AccountView } from "./Account.view";

export default function AccountPage() {
  const account = useAccountContainer();
  return <AccountView account={account} />;
}
