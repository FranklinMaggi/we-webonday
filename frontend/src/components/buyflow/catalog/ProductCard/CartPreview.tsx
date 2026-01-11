// ======================================================
// FE || CartPreview — UI PREVIEW + BE HANDOFF
// ======================================================

import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import type { ProductVM } from "../../../../lib/viewModels/product/Product.view-model";
import { eur } from "../../../../utils/format";
import { putCart } from "../../../../lib/cart/cart.api";
import { API_BASE } from "../../../../lib/config";
interface Props {
  solutionId: string;
  product: ProductVM;
  selectedOptions: string[];
}

export default function CartPreview({
  solutionId,
  product,
  selectedOptions,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  /* =========================
     PREVIEW PRICING (UI ONLY)
  ========================= */

  const startupFee = product.startupFee ?? 0;
  const yearlyFee = product.pricing.yearly ?? 0;

  const monthlyOptions = product.options.filter((o) =>
    selectedOptions.includes(o.id)
  );

  const monthlyFee =
    (product.pricing.monthly ?? 0) +
    monthlyOptions.reduce((s, o) => s + o.price, 0);

  /* =========================
     CONTINUE FLOW
  ========================= */

  const continueFlow = async () => {
    try {
      /* =========================
         1) CREATE CONFIGURATION
      ========================= */
      const res = await fetch(`${API_BASE}/api/configuration/from-cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName:"progetto",
          solutionId,
          productId: product.id,
          optionIds: selectedOptions,
        }),
      });
  
      if (!res.ok) {
        console.error("[CONFIG] creation failed", res.status);
        return;
      }
  
      const json: {
        configurationId: string;
        requiresConfiguration?: boolean;
      } = await res.json();
  
      if (!json.configurationId) {
        console.error("[CONFIG] invalid response", json);
        return;
      }
  
      /* =========================
         2) PUT CART (POINTER ONLY)
      ========================= */
      await putCart({
        configurationId: json.configurationId,
      });
  
      /* =========================
         3) FEEDBACK UI
      ========================= */
      ref.current?.classList.add("is-added");
      setTimeout(
        () => ref.current?.classList.remove("is-added"),
        400
      );
  
      /* =========================
         4) FLOW DECISION
      ========================= */
    navigate(`/user/configurator/${json.configurationId}`);}
    catch
    (err) {
      console.error("[CART_PREVIEW] continueFlow failed", err);
    }
  };
  

  /* =========================
     RENDER
  ========================= */

  return (
    <aside ref={ref} className="cart-preview">
      <h3>Riepilogo costi</h3>

      <div className="cart-line">
        <span>Prodotto</span>
        <strong>{product.name}</strong>
      </div>

      <div className="cart-line">
        <span>Avvio progetto</span>
        <strong>{eur.format(startupFee)}</strong>
      </div>

      {yearlyFee > 0 && (
        <div className="cart-line">
          <span>Canone annuale</span>
          <strong>{eur.format(yearlyFee)} / anno</strong>
        </div>
      )}

      {monthlyFee > 0 && (
        <div className="cart-line">
          <span>Canone mensile</span>
          <strong>{eur.format(monthlyFee)} / mese</strong>
        </div>
      )}

      <p className="cart-note">
        I prezzi sono indicativi e verranno confermati
        nel checkout.
      </p>

      <button
        className="wd-btn wd-btn--primary"
        onClick={continueFlow}
      >
        Continua
      </button>
    </aside>
  );
}
