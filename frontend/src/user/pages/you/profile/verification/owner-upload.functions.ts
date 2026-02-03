// ======================================================
// FE || PROFILE || OWNER DOCUMENT UPLOAD (MULTIPART)
// ======================================================
//
// FLOW:
// - POST multipart/form-data al backend
// - NESSUN presigned URL
// ======================================================

import { API_BASE } from "@src/shared/lib/config";


export async function uploadOwnerDocument(
  configurationId: string,
  side: "front" | "back",
  file: File
) {
  if (!configurationId) {
    throw new Error("MISSING_CONFIGURATION_ID");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("side", side);
  form.append("configurationId", configurationId);

  const res = await fetch(
    `${API_BASE}/api/owner/document/upload`,
    {
      method: "POST",
      body: form,
      credentials: "include",
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "UPLOAD_FAILED");
  }

  const json = await res.json();
  if (!json?.ok) {
    throw new Error(json?.error ?? "UPLOAD_FAILED");
  }
}
