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
  const executed = useRef(false); // 🔒 anti double-run

  const consumeBusinessName =
    usePreConfigurationStore((s) => s.consumeBusinessName);

  const { user, ready } = useAuthStore();
  const { data, setField } = useConfigurationSetupStore();

  // ======================================================
  // GUARD SINCRONO (PRE-EFFECT)
  // ======================================================
  useEffect(() => {
    if (!data.solutionId || !data.productId) {
      console.error(
        "[POST_LOGIN_HANDOFF][0] missing solutionId or productId",
        {
          solutionId: data.solutionId,
          productId: data.productId,
        }
      );
  
      navigate("/solution", { replace: true });
    }
  }, [data.solutionId, data.productId, navigate]);
  
  useEffect(() => {
    console.log("[POST_LOGIN_HANDOFF][1] effect start", {
      ready,
      user,
      configurationId: data.configurationId,
    });

    // =========================
    // GUARDIE CANONICHE
    // =========================
    if (!ready) {
      console.log("[POST_LOGIN_HANDOFF][2] auth not ready");
      return;
    }

    if (!user) {
      console.log("[POST_LOGIN_HANDOFF][3] no user (should not happen)");
      return;
    }

    if (data.configurationId) {
      console.log("[POST_LOGIN_HANDOFF][4] configuration already exists");
      return;
    }

    if (executed.current) {
      console.log("[POST_LOGIN_HANDOFF][5] already executed");
      return;
    }

    executed.current = true;

    async function create() {
      try {
        console.log("[POST_LOGIN_HANDOFF][6] starting create flow");

        const preBusinessName = consumeBusinessName();

        console.log("[POST_LOGIN_HANDOFF][7] business name sources", {
          preBusinessName,
          storeBusinessName: data.businessName,
        });

        if (!preBusinessName && !data.businessName) {
          throw new Error("MISSING_BUSINESS_NAME");
        }

        // 🔑 Iniezione store canonico
        if (preBusinessName && !data.businessName) {
          setField("businessName", preBusinessName);
        }

        const payload = {
          solutionId: data.solutionId,
          productId: data.productId,
          businessName:
            data.businessName || preBusinessName,
        };

        console.log(
          "[POST_LOGIN_HANDOFF][8] POST /api/configuration/base payload",
          payload
        );

        const res = await apiFetch<{
          ok: true;
          configurationId: string;
        }>("/api/configuration/base", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        console.log(
          "[POST_LOGIN_HANDOFF][9] create response",
          res
        );

        if (!res?.ok || !res.configurationId) {
          throw new Error("CREATE_CONFIGURATION_FAILED");
        }

        // 🔑 STORE = source of truth FE
        setField("configurationId", res.configurationId);

        console.log(
          "[POST_LOGIN_HANDOFF][10] redirect to workspace",
          res.configurationId
        );

        navigate(
          `/user/dashboard/workspace/${res.configurationId}`,
          { replace: true }
        );
      } catch (err) {
        console.error(
          "[POST_LOGIN_HANDOFF][ERR]",
          err
        );
        navigate("/user/dashboard", {
          replace: true,
        });
      }
    }

    create();
  }, [
    ready,
    user,
    data,
    setField,
    navigate,
    consumeBusinessName,
  ]);

  return null; // headless
}
