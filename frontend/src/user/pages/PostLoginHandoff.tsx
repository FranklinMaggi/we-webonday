// ======================================================
// FE || PostLoginHandoff
// ======================================================

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@shared/lib/store/auth.store";
import { useConfigurationSetupStore } from
  "@shared/domain/user/configurator/configurationSetup.store";
import { apiFetch } from "@shared/lib/api";

export default function PostLoginHandoff() {
  const navigate = useNavigate();
  const executed = useRef(false);

  const { user, ready } = useAuthStore();
  const { data, setField } = useConfigurationSetupStore();

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      navigate("/user/login", { replace: true });
      return;
    }

    if (data.configurationId) {
      navigate(
        `/user/dashboard/configurator/${data.configurationId}`,
        { replace: true }
      );
      return;
    }

    // 🔒 Guardia pre-login intent
    if (
      !data.businessName ||
      !data.solutionId ||
      !data.productId
    ) {
      navigate("/solution", { replace: true });
      return;
    }

    if (executed.current) return;
    executed.current = true;

    async function createConfiguration() {
      try {
        const res = await apiFetch<{
          ok: true;
          configurationId: string;
        }>("/api/configuration/create-base", {
          method: "POST",
          body: JSON.stringify({
            businessName: data.businessName,
            solutionId: data.solutionId,
            productId: data.productId,
          }),
        });

        if (!res?.ok || !res.configurationId) {
          throw new Error("CREATE_CONFIGURATION_FAILED");
        }

        setField("configurationId", res.configurationId);

        navigate(
          `/user/dashboard/configurator/${res.configurationId}`,
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
    data.businessName,
    data.solutionId,
    data.productId,
    data.configurationId,
    setField,
    navigate,
  ]);

  return null;
}