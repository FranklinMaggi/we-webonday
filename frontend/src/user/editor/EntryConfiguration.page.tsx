import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getPreConfiguration }from "./api/getPreconfiguration";


import { useConfigurationSetupStore }from "@src/user/editor/api/type/configurator/configurationSetup.store"
import ConfigurationSetupPage from "./Wizard/ConfigurationSetupPage";

export default function ConfigurationEntryPage() {
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { setField, reset } = useConfigurationSetupStore();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!configurationId) {
      navigate("/user/dashboard", { replace: true });
      return;
    }

    // 🔁 evita stati fantasma
    reset();

    getPreConfiguration(configurationId)
      .then((res) => {
        const cfg = res.configuration;

        if (!cfg) {
          navigate("/user/dashboard", { replace: true });
          return;
        }

        // ==========================================
        // 🔑 STORE INIT — BASE FIELDS ONLY
        // ==========================================
        setField("configurationId", cfg.id);
        setField("solutionId", cfg.solutionId);
        setField("productId", cfg.productId)

        
        // ✅ PREFILL BUSINESS NAME (BASE READ → STORE)
        if (cfg.businessName) {
          setField("businessName", cfg.businessName);
        }




        
      })
      .catch(() => {
        navigate("/user/dashboard", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [configurationId, navigate, reset, setField]);

  /* ======================================================
     UI GUARD
  ====================================================== */
  if (loading) {
    return <p>Preparazione configurazione…</p>;
  }

  return <ConfigurationSetupPage />;
}