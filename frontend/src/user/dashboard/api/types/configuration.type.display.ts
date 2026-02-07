// ======================================================
// FE || CONFIGURATION || DISPLAY HELPERS (CANONICAL)
// ======================================================

import type { ConfigurationUserSummaryDTO } from
  "@src/user/editor/api/DataTransferObject/ConfigurationConfiguratorDTO";
import { t } from "@shared/aiTranslateGenerator";

export function getConfigurationDisplayName(
  cfg: ConfigurationUserSummaryDTO
): string {
  return (
    cfg.businessName?.trim() ||
    cfg.prefill?.businessName?.trim() ||
    cfg.display?.businessName?.trim() || // ultimo, solo legacy/UX
    t("configuration.name.fallback")
  );
}
