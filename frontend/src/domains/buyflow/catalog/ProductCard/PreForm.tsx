// ======================================================
// FE || BuyFlow PreForm — Configuration Bootstrap
// ======================================================
//
// RUOLO:
// - Raccolta dati minimi pre-login
// - Creazione UNICA della Configuration Base (BE)
//
// INVARIANTI:
// - Nessun cart
// - Nessun checkout
// - Nessuna option selection
// - La Configuration nasce SEMPRE
// - Login serve solo per continuare
//
// ======================================================

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../../lib/store/auth.store";
import { useIdentityStore } from "../../../../lib/store/identity.store";

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
  const identityId = useIdentityStore((s) => s.identityId);

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
      // 1) CREATE CONFIGURATION BASE (VISITOR OR USER)
      // ======================================================
      const res = await fetch(
        `${API_BASE}/api/configuration/base`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-WOD-Identity": identityId, // 🔑 identity-first
          },
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

      const { configurationId } = await res.json();

      if (!configurationId) {
        console.error("[CONFIG] invalid response");
        return;
      }

      // ======================================================
      // 2) HANDOFF
      // ======================================================
      if (!user) {
        // visitor → login → ritorno alla configuration
        navigate(
          `/user/login?redirect=/user/dashboard/workspace/${configurationId}`,
          { replace: true }
        );
        return;
      }

      // user già loggato → workspace diretto
      navigate(
        `/user/dashboard/workspace/${configurationId}`,
        { replace: true }
      );
    } catch (err) {
      console.error(
        "[BUYFLOW_PREFORM] continueFlow failed",
        err
      );
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
          onChange={(e) =>
            setBusinessName(e.target.value)
          }
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
