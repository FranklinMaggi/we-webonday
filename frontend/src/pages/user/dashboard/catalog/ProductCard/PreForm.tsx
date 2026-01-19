// FE || BuyFlow PreForm — Configuration Bootstrap (CANONICAL)

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../../../lib/store/auth.store";
import { usePreConfigurationStore } from "../../configurator/store/pre-configuration.store";
import { apiFetch } from "../../../../../lib/api";

import type { ProductVM } from "../../../../../lib/viewModels/product/Product.view-model";

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
  const setPreBusinessName =
    usePreConfigurationStore((s) => s.setBusinessName);

  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     CONTINUE FLOW (CANONICAL)
  ========================= */
  async function continueFlow() {
    const name = businessName.trim();
    if (!name || loading) return;

    // =========================
    // NOT AUTHENTICATED → HANDOFF
    // =========================
    if (!user) {
      setPreBusinessName(name);

      navigate(
        `/user/login?redirect=/user/post-login`,
        { replace: true }
      );
      return;
    }

    // =========================
    // AUTHENTICATED → CREATE NOW
    // =========================
    try {
      setLoading(true);

      const res = await apiFetch<{
        ok: true;
        configurationId: string;
      }>("/api/configuration/base", {
        method: "POST",
        body: JSON.stringify({
          solutionId,
          productId: product.id,
          businessName: name,
        }),
      });

      if (!res?.ok || !res.configurationId) {
        throw new Error("CREATE_CONFIGURATION_FAILED");
      }

      navigate(
        `/user/dashboard/workspace/${res.configurationId}`,
        { replace: true }
      );
    } catch (err) {
      console.error("[BUYFLOW_PREFORM]", err);
      alert("Errore nella creazione della configurazione");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <aside ref={ref} className="cart-preview">
      <h3>Avvia la configurazione</h3>

      <p className="cart-note">
        Inserisci il nome della tua attività.
      </p>

      <label className="wd-field">
        <span className="wd-field__label">
          Nome attività
        </span>

        <input
          type="text"
          className="wd-input"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      </label>

      <button
        className="wd-btn wd-btn--primary"
        disabled={!businessName.trim() || loading}
        onClick={continueFlow}
      >
        {loading ? "Creazione…" : "Continua"}
      </button>
    </aside>
  );
}
