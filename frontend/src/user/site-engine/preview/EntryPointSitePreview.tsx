// ======================================================
// FE || WORKSPACE PREVIEW — ENTRY POINT (TEMPLATE-DRIVEN)
// ======================================================

import { useMemo } from "react";
import { useWorkspaceState } from "../workspace/workspace.state";
import { useBusinessByConfiguration } from
  "../business/api/useBusinessByConfiguration";

import { buildCanvas } from
  "@src/user/site-engine/engine/builder/buildCanvas";

import SiteView from "./view/SiteView";
import { resolveTemplateFallback } from
  "../template/resolveTemplate";

export default function EntryPointSitePreview() {
  const { activeConfigurationId } = useWorkspaceState();

  const { business, loading, error } =
    useBusinessByConfiguration(activeConfigurationId);

  const canvas = useMemo(() => {
    if (!activeConfigurationId || !business) return null;

    const template = resolveTemplateFallback();

    return buildCanvas({
      configurationId: activeConfigurationId,

      business: {
        name: business.businessName,
        slug: business.businessName
          .toLowerCase()
          .replace(/\s+/g, "-"),
        sector: business.solutionId ?? "generic",
        address: business.address
          ? `${business.address.street ?? ""} ${business.address.city ?? ""}`
          : "",
        openingHours: business.openingHours,
        descriptionText: business.businessDescriptionText,
      },

      layout: template.layout,
      style: template.style,
      palette: template.palette,
    });
  }, [activeConfigurationId, business]);

  const phoneNumber =
    business?.contact?.phoneNumber ?? null;

  /* =====================
     UI STATES
  ====================== */
  if (!activeConfigurationId) {
    return <div>Nessuna configurazione selezionata</div>;
  }

  if (loading) {
    return <div>Caricamento anteprima…</div>;
  }

  if (error || !canvas) {
    return <div>Anteprima non disponibile</div>;
  }

  return (
    <SiteView
      canvas={canvas}
      phoneNumber={phoneNumber}
    />
  );
}
