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

import { usePreConfigurationStore } from
  "../../../../pages/user/dashboard/configurator/store/pre-configuration.store";
import type { ProductVM } from
  "../../../../lib/viewModels/product/Product.view-model";

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
    <aside ref={ref} className="cart-preview">
      <h3>Avvia la configurazione</h3>

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
        />
      </label>

      <button
        className="wd-btn wd-btn--primary"
        disabled={!businessName.trim()}
        onClick={continueFlow}
      >
        Continua
      </button>
    </aside>
  );
}
