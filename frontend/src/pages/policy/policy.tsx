// ======================================================
// FE || pages/policy/policy.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Pagina legale Policy / Termini
//
// INVARIANTI:
// - Read-only
// - Contenuto dal BE
// - Usa PolicyViewer
//
// ======================================================

import { PolicyViewer } from "../../components/policy/policyViewer";

export default function PolicyPage() {
  return <PolicyViewer scope="general" />;
}
