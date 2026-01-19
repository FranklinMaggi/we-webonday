import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../../../lib/store/auth.store";
import { usePreConfigurationStore } from "../../configurator/store/pre-configuration.store";
import type { ProductVM } from "../../../../../lib/viewModels/product/Product.view-model";

interface Props {
  solutionId: string;
  product: ProductVM;
}

export default function BuyflowPreForm({ solutionId, product }: Props) {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const setPreConfig = usePreConfigurationStore(
    (s) => s.setPreConfig
  );

  const [businessName, setBusinessName] = useState("");

  const continueFlow = () => {
    const trimmed = businessName.trim();
    if (!trimmed) return;

    // 🔑 PRECONFIG ATOMICA
    setPreConfig({
      businessName: trimmed,
      solutionId,
      productId: product.id,
    });

    // 👉 SEMPRE POST-LOGIN
    navigate(
      user
        ? "/post-login"
        : "/user/login?redirect=/post-login",
      { replace: true }
    );
  };

  return (
    <aside ref={ref} className="cart-preview">
      <h3>Avvia la configurazione</h3>

      <label className="wd-field">
        <span className="wd-field__label">Nome attività</span>
        <input
          className="wd-input"
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
