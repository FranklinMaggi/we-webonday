// ======================================================
// FE || pages/user/configurator/index.tsx
// ======================================================
//
// CONFIGURATOR ENTRY (NO CONFIGURATION)
//
// RUOLO:
// - Avvia wizard quando NON esiste ancora una configuration
//
// SOURCE OF TRUTH:
// - Zustand FE store
//
// COSA NON FA:
// - NON persiste backend
// - NON crea business
// - NON gestisce ordini
// ======================================================
// ======================================================
// FE || pages/user/configurator/index.tsx
// ======================================================
//
// RUOLO:
// - Wizard FE-only
// - Usato quando NON esiste ancora una configuration
//
// ======================================================
// ======================================================
// FE || pages/user/configurator/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATOR ENTRY (NO ID)
//
// RUOLO:
// - Avvio wizard quando NON esiste ancora una Configuration
//
// SOURCE OF TRUTH:
// - Zustand (configurationSetupStore)
//
// COSA FA:
// - Wizard FE-only
//
// COSA NON FA:
// - NON crea Business
// - NON persiste backend
// - NON gestisce ordini
//
// ======================================================
import { useNavigate } from "react-router-dom";
import ConfigurationSetupPage from "./setup/ConfigurationSetupPage";
import { useEffect } from "react";


export default function UserConfiguratorIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    const pending = localStorage.getItem("PENDING_CART");
    if (!pending) {
      navigate("/user/configurator");
      return;
    }
  }, []);
  return <ConfigurationSetupPage />;
}
