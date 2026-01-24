// FE || pages/Pricing/Price.tsx
// ======================================================
// PRICING PAGE — WEBONDAY
// ======================================================
//
// RUOLO:
// - Pagina pubblica prezzi
// - Punto di atterraggio commerciale
// - Riutilizza PricingTable come source of truth
//
// URL:
// /pricing
//
// ======================================================

import PricingTable from "../../components/Tables/PricingTabel";

export default function Price() {
  return (
    <div className="wd-table">

    

      {/* CONTENUTO */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <PricingTable />
      </main>

    </div>
  );
}
