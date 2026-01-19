// FE || PostLoginHandoff.tsx
// ======================================================
// RUOLO:
// - Punto UNICO di creazione Configuration post-login
// - Ponte pre-login → post-login
// ======================================================

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePreConfigurationStore } from "./dashboard/configurator/store/pre-configuration.store";

import { useAuthStore } from "../../lib/store/auth.store";
import { useConfigurationSetupStore } from "./dashboard/configurator/store/configurationSetup.store";
import { apiFetch } from "../../lib/api";

export default function PostLoginHandoff() {
  const navigate = useNavigate();
  const consumeBusinessName =
  usePreConfigurationStore(
    (s) => s.consumeBusinessName
  );
  const { user, ready } = useAuthStore();
  const { data, setField } = useConfigurationSetupStore();
 
  if (!data.solutionId || !data.productId) {
    console.error("[POST_LOGIN_HANDOFF] missing solution/product");
    navigate("/solution", { replace: true });
    return;
  }
  const executed = useRef(false); // 🔒 anti double-run

  useEffect(() => {
    // =========================
    // GUARDIE CANONICHE
    // =========================
    if (!ready) return;
    if (!user) return;
    if (data.configurationId) return;
    if (executed.current) return;

    executed.current = true;

    async function create() {
      try {

        const preBusinessName = consumeBusinessName();

if (!preBusinessName && !data.businessName) {
  throw new Error("MISSING_BUSINESS_NAME");
}

// 🔑 se arriva dal pre-login, iniettiamo nello store canonico
if (preBusinessName && !data.businessName) {
  setField("businessName", preBusinessName);
}
        const res = await apiFetch<{
          ok: true;
          configurationId: string;
        }>("/api/configuration/base", {
          method: "POST",
          body: JSON.stringify({
            solutionId: data.solutionId,
            productId: data.productId,
            businessName: data.businessName,
          }),
        });

        if (!res?.ok) {
          throw new Error("CREATE_CONFIGURATION_FAILED");
        }

        // 🔑 STORE = source of truth FE
        setField("configurationId", res.configurationId);

        // 🎯 HANDOFF DEFINITIVO
        navigate(
          `/user/dashboard/workspace/${res.configurationId}`,
          { replace: true }
        );
      } catch (err) {
        console.error("[POST_LOGIN_HANDOFF]", err);
        navigate("/user/dashboard", { replace: true });
      }
    }

    create();
  }, [ready, user, data, setField, navigate]);

  return null; // headless
}
