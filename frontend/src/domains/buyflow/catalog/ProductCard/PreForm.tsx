// ======================================================
// FE || BuyFlow PreForm — Configuration Bootstrap
// ======================================================
//
// RUOLO:
// - Raccolta dati minimi pre-login
// - Creazione UNICA della Configuration Base (BE)
// - BuyFlow NON decide la destinazione finale
//
// INVARIANTI:
// - Nessun cart
// - Nessun checkout
// - Nessuna option selection
// - Redirect SEMPRE a /user/dashboard
//
// ======================================================

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../lib/store/auth.store";
import type { ProductVM } from "../../../../lib/viewModels/product/Product.view-model";
import { API_BASE } from "../../../../lib/config";

interface Props {
  solutionId: string;
  product: ProductVM;
}

export default function BuyflowPreForm({
  solutionId,
  product,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // =========================
  // CONFIGURATION BASE INPUT
  // =========================
  const [businessName, setBusinessName] = useState("");

  /* =========================
     CONTINUE FLOW
  ========================= */
  const continueFlow = async () => {
    try {
      // ======================================================
      // 0) VISITOR → LOGIN
      // ======================================================
      if (!user) {
        navigate("/user/login?redirect=/user/dashboard");
        return;
      }

      // ======================================================
      // 1) CREATE CONFIGURATION BASE
      // ======================================================
      const res = await fetch(
        `${API_BASE}/api/configuration/base`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            solutionId,
            productId: product.id,
            businessName: businessName.trim(),
          }),
        }
      );

      if (!res.ok) {
        console.error("[CONFIG] creation failed", res.status);
        return;
      }

      const json: { configurationId: string } = await res.json();

      if (!json.configurationId) {
        console.error("[CONFIG] invalid response", json);
        return;
      }

      // ======================================================
      // 2) HANDOFF → DASHBOARD (CANONICO)
      // ======================================================
     navigate(`/user/configurator/${json.configurationId}`);

    } catch (err) {
      console.error("[BUYFLOW_PREFORM] continueFlow failed", err);
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <aside ref={ref} className="cart-preview">
      <h3>Avvia la configurazione</h3>

      <p className="cart-note">
        Inserisci il nome della tua attività.  
        Potrai completare tutti i dettagli dopo l’accesso.
      </p>

      <label className="wd-field">
        <span className="wd-field__label">
          Nome attività
        </span>

        <input
          type="text"
          className="wd-input"
          placeholder="Es. Studio Medico Rossi"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
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
