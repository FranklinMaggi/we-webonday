// ======================================================
// FE || PostLoginHandoff
// ======================================================
//
// RUOLO:
// - Punto UNICO di creazione Configuration post-login
// - Ponte atomico pre-login → post-login
//
// INVARIANTI:
// - CREA solo se user autenticato
// - Consuma PreConfiguration UNA SOLA VOLTA
// - Redirect deterministico
//
// ======================================================

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../shared/lib/store/auth.store";
import { usePreConfigurationStore } from
  "../configurator/base_configuration/configuration/pre-configuration.store";
import { useConfigurationSetupStore } from
  "../configurator/base_configuration/configuration/configurationSetup.store";

import { apiFetch } from "../../shared/lib/api";

export default function PostLoginHandoff() {
  const navigate = useNavigate();
  const executed = useRef(false); // 🔒 anti double-run

  const { user, ready } = useAuthStore();
  const consumePreConfig = usePreConfigurationStore(
    (s) => s.consume
  );

  const { data, setField } = useConfigurationSetupStore();

  useEffect(() => {
    console.log("[POST_LOGIN][1] effect start", {
      ready,
      user,
      configurationId: data.configurationId,
    });

    // =========================
    // GUARDIE CANONICHE
    // =========================
    if (!ready) {
      console.log("[POST_LOGIN][2] auth not ready");
      return;
    }

    if (!user) {
      console.log("[POST_LOGIN][3] no user");
      navigate("/user/login", { replace: true });
      return;
    }

    if (data.configurationId) {
      console.log("[POST_LOGIN][4] configuration already exists");
      navigate(
        `/user/dashboard/workspace/${data.configurationId}`,
        { replace: true }
      );
      return;
    }

    if (executed.current) {
      console.log("[POST_LOGIN][5] already executed");
      return;
    }

    // =========================
    // CONSUMO PRE-CONFIG
    // =========================
    const pre = consumePreConfig();

    console.log("[POST_LOGIN][6] consumed pre-config", pre);

    if (!pre) {
      console.warn("[POST_LOGIN][7] missing pre-config");
      navigate("/solution", { replace: true });
      return;
    }

    const { solutionId, productId, businessName } = pre;

    if (!solutionId || !productId || !businessName) {
      console.error("[POST_LOGIN][8] invalid pre-config", pre);
      navigate("/solution", { replace: true });
      return;
    }

    executed.current = true;

    async function createConfiguration() {
      try {
        const payload = {
          solutionId,
          productId,
          businessName,
        };

        console.log(
          "[POST_LOGIN][9] POST /api/configuration/base",
          payload
        );

        const res = await apiFetch<{
          ok: true;
          configurationId: string;
        }>("/api/configuration/base", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        console.log("[POST_LOGIN][10] response", res);

        if (!res?.ok || !res.configurationId) {
          throw new Error("CREATE_CONFIGURATION_FAILED");
        }

        // =========================
        // STORE CANONICO
        // =========================
        setField("configurationId", res.configurationId);
        setField("solutionId", solutionId);
        setField("productId", productId);
        setField("businessName", businessName);

        console.log(
          "[POST_LOGIN][11] redirect workspace",
          res.configurationId
        );

        navigate(
          `/user/dashboard/workspace/${res.configurationId}`,
          { replace: true }
        );
      } catch (err) {
        console.error("[POST_LOGIN][ERR]", err);
        navigate("/user/dashboard", { replace: true });
      }
    }

    createConfiguration();
  }, [
    ready,
    user,
    data.configurationId,
    consumePreConfig,
    setField,
    navigate,
  ]);

  return null; // headless
}
