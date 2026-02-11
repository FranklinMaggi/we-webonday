import { useEffect } from "react";

import { initWhatsAppScrollWatcher } from "@src/shared/ui/scrollWatcher";

import CatalogSolution from "./catalogue/Catalog.solution.page";

export default function Solutions() {
  
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  return (
    <main className="solutions-page">
     
      {/* ================= CATALOG ================= */}
      <CatalogSolution />

      
    </main>
  );
}
