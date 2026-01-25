// ======================================================
// FE || BuyflowPreForm
// ======================================================
//
// RUOLO:
// - Raccolta dati MINIMI pre-login
// - Scrittura atomica PreConfiguration
// - Redirect SEMPRE a PostLoginHandoff
//
// NON FA:
// - ❌ Nessun fetch
// - ❌ Nessuna auth logic
// - ❌ Nessuna creazione Configuration
//
// SOURCE OF TRUTH:
// - PreConfigurationStore
//
// ======================================================

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useConfigurationSetupStore } from "@src/shared/domain/user/configurator/configurationSetup.store";
import { usePreConfigurationStore } from
  "../../../../user/configurator/base_configuration/configuration/pre-configuration.store";
import type { ProductVM } from
  "../../../../shared/lib/viewModels/product/Product.view-model";

interface Props {
  solutionId: string;
  product: ProductVM;
}

export default function BuyflowPreForm({
  solutionId,
  product,
}: Props) {
  /* =========================
     REFS / NAV
  ========================= */
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const resetSetup = useConfigurationSetupStore(s => s.reset);
  /* =========================
     STORE (WRITE ONLY)
  ========================= */
  const setPreConfig = usePreConfigurationStore(
    (s) => s.setPreConfig
  );

  /* =========================
     LOCAL STATE
  ========================= */
  const [businessName, setBusinessName] = useState("");

  /* ======================================================
     CONTINUE FLOW (CANONICAL)
  ====================================================== */
  function continueFlow() {
    const trimmed = businessName.trim();
    if (!trimmed) return;
      // 🔥 SBLOCCO STATE MACHINE
      resetSetup();
    // 🔑 PRE-CONFIG ATOMICA (UNICA RESPONSABILITÀ)
    setPreConfig({
      businessName: trimmed,
      solutionId,
      productId: product.id,
    });

    // 👉 SEMPRE HANDOFF POST-LOGIN
    navigate("/user/post-login", { replace: true });
  }

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <aside ref={ref} className="buyflow-preform">
    <header className="buyflow-preform__head">
     
  
      <h3 className="buyflow-preform__title">
        Iniziamo dalla tua attività
      </h3>
  
      <p className="buyflow-preform__hint">
        Questo ci serve per personalizzare la configurazione.
      </p>
    </header>
  
    <div className="buyflow-preform__body">
      <label className="wd-field">
        <span className="wd-field__label">
          Nome attività
        </span>
  
        <input
          className="wd-input"
          value={businessName}
          onChange={(e) =>
            setBusinessName(e.target.value)
          }
          placeholder="Es. Pizzeria Da Mario"
          autoFocus
        />
      </label>
    </div>
  
    <footer className="buyflow-preform__footer">
      
  
      <button
        className="buyflow-preform__action"
        disabled={!businessName.trim()}
        onClick={continueFlow}
      >
        Continua
      </button>
    </footer>
  </aside>
  

  );
}
