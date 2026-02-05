// ======================================================
// FE || USER DASHBOARD || PROFILE — CLASSES
// ======================================================
//
// NOTE:
// - Retro-compatibile con Profile read-only
// - Esteso per Verification Flow (2 step)
// - Nomi semantici, niente duplicazioni
// ======================================================

export const profileClasses = {
  /* =========================
     PAGE
  ========================= */
  root: "profile-page",
  header: "profile-header",
  cta: "profile-cta",

  /* =========================
     CARD / SECTIONS
  ========================= */
  card: "profile-card",
  section: "profile-section",

  /* =========================
     ROWS (READ MODE)
  ========================= */
  row: "profile-row",
  label: "profile-label",
  value: "profile-value",

  /* =========================
     STATUS
  ========================= */
  statusComplete: "status-complete",
  statusVerified: "status-verified",
  statusDot: "status-dot",

  /* =========================
     VERIFICATION FLOW
  ========================= */
  verifyCta: "profile-verify-cta",
  verifyForm: "profile-verify-form",
  verifyHint: "profile-verify-hint",
  verifyActions: "profile-verify-actions",

  /* =========================
     FORM / EDIT MODE
  ========================= */
  formGrid: "form-grid",
  formRow: "profile-form-row",
  formLabel: "profile-form-label",
  formInput: "profile-form-input",
  /* =====================
     UPLOAD (STEP 2)
  ====================== */
  uploadGrid: "profile-upload-grid",
  uploadBox: "profile-upload-box",
  uploadImage: "profile-upload-image",
  /* =========================
     PRIVACY (READ-ONLY)
  ========================= */
  privacyHint: "profile-privacy-hint",
  privacyLink: "profile-privacy-link",

  /* =========================
     STEPS
  ========================= */
  stepIndicator: "profile-step-indicator",
  stepActive: "profile-step-active",
  stepCompleted: "profile-step-completed",

  /* =====================
   UPLOAD ACTIONS
===================== */
uploadDelete: "profile-upload-delete",
uploadRotate: "profile-upload-rotate",
uploadConfirm: "profile-upload-confirm",

/* =========================
   STATUS DOTS
========================= */

statusPending: "profile-status-pending",
statusAccepted: "profile-status-accepted",
statusRejected: "profile-status-rejected",


};
